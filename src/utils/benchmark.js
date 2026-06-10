/**
 * Global benchmarking helpers: compare a user's footprint to reference averages
 * and compute a global percentile ranking.
 */
import { CITIES, COUNTRIES, GLOBAL_AVG, getCountry } from '../data/countries'

/** Percentage difference vs an average (positive = user is lower/better). */
export function compareToAverage(userKg, avgKg) {
  if (!avgKg) return { pct: 0, lower: false }
  const diff = ((avgKg - userKg) / avgKg) * 100
  return { pct: Math.round(Math.abs(diff)), lower: diff >= 0 }
}

/**
 * Global percentile: what share of reference populations you out-perform.
 * Returns { topPercent, betterThanPct }.
 */
export function globalPercentile(userKg) {
  const refs = [
    ...COUNTRIES.map((c) => c.monthlyAvgKg),
    ...CITIES.map((c) => c.monthlyAvgKg),
  ]
  if (!refs.length || !userKg) return { topPercent: 50, betterThanPct: 50 }
  const betterThan = refs.filter((r) => r > userKg).length / refs.length
  const betterThanPct = Math.round(betterThan * 100)
  const topPercent = Math.max(1, 100 - betterThanPct)
  return { topPercent, betterThanPct }
}

/** Build dashboard insight strings for a user. */
export function benchmarkInsights(userKg, profile = {}) {
  const insights = []
  const country = getCountry(profile.country)
  if (country) {
    const c = compareToAverage(userKg, country.monthlyAvgKg)
    insights.push(
      `You emit ${c.pct}% ${c.lower ? 'less' : 'more'} CO₂ than the average user in ${country.name}.`,
    )
  }
  const city = CITIES.find((ci) => ci.city === profile.city)
  if (city) {
    const c = compareToAverage(userKg, city.monthlyAvgKg)
    insights.push(
      `Your footprint is ${c.pct}% ${c.lower ? 'lower' : 'higher'} than users in ${city.city}.`,
    )
  }
  const g = compareToAverage(userKg, GLOBAL_AVG.monthlyAvgKg)
  insights.push(`Globally, you emit ${g.pct}% ${g.lower ? 'less' : 'more'} than average.`)
  const { topPercent } = globalPercentile(userKg)
  insights.push(`You rank in the top ${topPercent}% of environmentally conscious users globally.`)
  return insights
}

/** Comparison chart data: user vs city, country, global averages. */
export function comparisonChartData(userKg, profile = {}) {
  const rows = [{ name: 'You', value: Math.round(userKg), highlight: true }]
  const city = CITIES.find((ci) => ci.city === profile.city)
  if (city) rows.push({ name: city.city, value: city.monthlyAvgKg })
  const country = getCountry(profile.country)
  if (country) rows.push({ name: country.name, value: country.monthlyAvgKg })
  rows.push({ name: 'Global avg', value: GLOBAL_AVG.monthlyAvgKg })
  return rows
}
