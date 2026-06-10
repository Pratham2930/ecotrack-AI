/**
 * AI Climate Coach — rule-based analysis engine.
 *
 * Pure functions that turn a user's footprint history into behavioural insights,
 * daily challenges, weekly reports and monthly roadmaps. These run entirely
 * client-side (no key required) and also serve as the fallback when the optional
 * OpenAI-backed serverless endpoint is unavailable.
 */
import { formatKg } from './carbon'
import { generateRecommendations } from './recommendations'
import { trendChange } from './series'

/** A rotating daily eco challenge derived from the user's biggest category. */
export function generateDailyChallenge(latest) {
  const base = [
    { text: 'Walk or cycle 2 km instead of using a vehicle today', points: 15, tag: 'transport' },
    { text: 'Reduce your electricity usage by 10% today', points: 10, tag: 'energy' },
    { text: 'Eat at least one fully plant-based meal', points: 12, tag: 'food' },
    { text: 'Recycle all your plastic and paper waste today', points: 10, tag: 'waste' },
    { text: 'Use a reusable bottle and bag all day', points: 8, tag: 'waste' },
    { text: 'Take public transport for one trip', points: 12, tag: 'transport' },
  ]
  if (!latest) return base[new Date().getDate() % base.length]
  // Bias toward the category with the highest emissions.
  const cats = [
    { tag: 'transport', value: latest.transport || 0 },
    { tag: 'energy', value: latest.energy || 0 },
    { tag: 'food', value: latest.food || 0 },
    { tag: 'waste', value: latest.waste || 0 },
  ].sort((a, b) => b.value - a.value)
  const top = cats[0].tag
  const matching = base.filter((b) => b.tag === top)
  const pool = matching.length ? matching : base
  return pool[new Date().getDate() % pool.length]
}

/** Behavioural analysis: dominant category, trend direction, consistency. */
export function analyzeBehavior(entries = []) {
  if (!entries.length) {
    return { dominant: null, trend: null, consistency: 'none', message: 'Log a footprint to begin analysis.' }
  }
  const latest = entries[entries.length - 1]
  const cats = [
    { key: 'transport', label: 'Transport', value: latest.transport || 0 },
    { key: 'energy', label: 'Home energy', value: latest.energy || 0 },
    { key: 'food', label: 'Food', value: latest.food || 0 },
    { key: 'waste', label: 'Waste', value: latest.waste || 0 },
  ].sort((a, b) => b.value - a.value)
  const dominant = cats[0]
  const change = trendChange(entries)
  const consistency = entries.length >= 4 ? 'high' : entries.length >= 2 ? 'medium' : 'low'
  let message = `Your largest source of emissions is ${dominant.label.toLowerCase()} (${formatKg(dominant.value)}/mo).`
  if (change != null) {
    message +=
      change <= 0
        ? ` Great news — your footprint dropped ${Math.abs(change)}% since your last entry.`
        : ` Your footprint rose ${change}% since your last entry; let’s reverse that.`
  }
  return { dominant, trend: change, consistency, message }
}

/** Weekly performance report. */
export function generateWeeklyReport({ entries = [], stats = {} }) {
  const analysis = analyzeBehavior(entries)
  const recs = entries.length
    ? generateRecommendations(entries[entries.length - 1], entries[entries.length - 1].inputs)
    : []
  return {
    title: 'Weekly Sustainability Report',
    period: 'Last 7 days',
    highlights: [
      `Current streak: ${stats.currentStreak || 0} day(s).`,
      `Eco points earned to date: ${stats.points || 0}.`,
      analysis.message,
    ],
    focus: recs[0]?.title || 'Keep maintaining your low-carbon habits.',
    actions: recs.slice(0, 3).map((r) => r.title),
  }
}

/** Monthly improvement roadmap with staged milestones. */
export function generateMonthlyRoadmap(entries = []) {
  if (!entries.length) {
    return {
      title: 'Monthly Improvement Roadmap',
      target: 'Log your first footprint to generate a roadmap.',
      milestones: [],
    }
  }
  const latest = entries[entries.length - 1]
  const recs = generateRecommendations(latest, latest.inputs)
  const target = Math.round(latest.total * 0.85)
  return {
    title: 'Monthly Improvement Roadmap',
    target: `Reduce your footprint to ${formatKg(target)} CO₂e (−15%) this month.`,
    milestones: [
      { week: 'Week 1', goal: recs[0]?.title || 'Audit your biggest emission source', saving: recs[0]?.savingKg || 0 },
      { week: 'Week 2', goal: recs[1]?.title || 'Adopt one new low-carbon habit', saving: recs[1]?.savingKg || 0 },
      { week: 'Week 3', goal: recs[2]?.title || 'Maintain your streak for 7 days', saving: recs[2]?.savingKg || 0 },
      { week: 'Week 4', goal: 'Re-measure your footprint and celebrate progress', saving: 0 },
    ],
  }
}

/** Local rule-based chat reply used as the offline fallback for the coach. */
export function ruleBasedReply(message, context = {}) {
  const q = (message || '').toLowerCase()
  const { entries = [], stats = {} } = context
  const analysis = analyzeBehavior(entries)

  if (/\b(hi|hello|hey)\b/.test(q)) {
    return "Hi! I'm your AI Climate Coach. Ask me about reducing your footprint, your biggest emission source, or for a weekly plan."
  }
  if (q.includes('biggest') || q.includes('highest') || q.includes('most')) {
    return analysis.dominant
      ? `Your biggest source is ${analysis.dominant.label.toLowerCase()} at ${formatKg(analysis.dominant.value)}/month. Tackling it first gives the fastest wins.`
      : 'Log a footprint first and I can pinpoint your biggest emission source.'
  }
  if (q.includes('transport') || q.includes('car') || q.includes('drive')) {
    return 'For transport: combine trips, carpool, switch short drives to walking or cycling, and use rail over flights where possible. Even a 20% cut in car travel meaningfully lowers your footprint.'
  }
  if (q.includes('energy') || q.includes('electricity') || q.includes('power')) {
    return 'For home energy: switch to LED bulbs, unplug idle electronics, wash clothes cold, and consider a green energy tariff. A smart thermostat can cut heating/cooling waste by ~10-15%.'
  }
  if (q.includes('food') || q.includes('diet') || q.includes('eat')) {
    return 'For food: shifting a few meals a week to plant-based options is one of the highest-impact diet changes. Reducing food waste and buying local/seasonal also helps.'
  }
  if (q.includes('waste') || q.includes('recycl') || q.includes('plastic')) {
    return 'For waste: prioritise refuse > reduce > reuse > recycle. Cutting single-use plastic and composting food scraps lowers methane emissions from landfill.'
  }
  if (q.includes('plan') || q.includes('week') || q.includes('report')) {
    const report = generateWeeklyReport({ entries, stats })
    return `${report.focus} This week, try: ${report.actions.slice(0, 2).join('; ') || 'maintaining your current habits'}.`
  }
  if (q.includes('streak')) {
    return `Your current streak is ${stats.currentStreak || 0} day(s). Log a daily eco habit on the Green Streak page to keep it alive! 🔥`
  }
  if (q.includes('offset') || q.includes('tree')) {
    return 'Offsetting is a complement, not a substitute, for reducing emissions. Check the Carbon Offset page to see how many trees would neutralise your footprint.'
  }
  return `${analysis.message} Ask me about transport, energy, food, or waste for specific strategies, or say "give me a weekly plan".`
}
