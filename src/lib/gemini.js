import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI = null
let model = null

function getModel() {
  if (!API_KEY) return null
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY)
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }
  return model
}

// ─── Prompt builders ─────────────────────────────────────────────────────────

const systemContext = `You are EcoTrack AI, an expert sustainability coach and climate scientist. 
You provide personalized, data-driven advice to help users reduce their carbon footprint.
Always be specific, encouraging, and actionable. Use metrics and percentages where possible.
Format responses as clean, readable text without markdown headers (just plain paragraphs or bullet points starting with •).`

export async function generatePersonalizedInsight(userProfile) {
  const m = getModel()
  if (!m) return getFallbackInsight(userProfile)

  const prompt = `${systemContext}

User profile:
- Name: ${userProfile.name}
- Location: ${userProfile.location || 'Unknown'}
- Carbon footprint: ${userProfile.totalCO2 || 0} kg CO₂/year
- Sustainability score: ${userProfile.sustainabilityScore || 50}/100
- Streak: ${userProfile.currentStreak || 0} days
- Top emission category: ${userProfile.topCategory || 'Transportation'}
- Recent activities: ${userProfile.recentActivities?.join(', ') || 'None logged'}

Generate a personalized 3-sentence sustainability insight and one specific action they can take today to reduce emissions in their top category. Be direct and specific to their data.`

  try {
    const result = await m.generateContent(prompt)
    return result.response.text()
  } catch (e) {
    console.error('Gemini error:', e)
    return getFallbackInsight(userProfile)
  }
}

export async function generateChatResponse(userMessage, conversationHistory, userProfile) {
  const m = getModel()
  if (!m) return getFallbackChatResponse(userMessage)

  const historyText = conversationHistory
    .slice(-6)
    .map(msg => `${msg.role === 'user' ? 'User' : 'EcoTrack AI'}: ${msg.text}`)
    .join('\n')

  const prompt = `${systemContext}

User stats: ${userProfile.totalCO2 || 0} kg CO₂/year, score: ${userProfile.sustainabilityScore || 50}/100, streak: ${userProfile.currentStreak || 0} days, location: ${userProfile.location || 'India'}

Recent conversation:
${historyText}

User: ${userMessage}

Respond as EcoTrack AI in 2-4 sentences. Be specific to their data and location. No markdown formatting.`

  try {
    const result = await m.generateContent(prompt)
    return result.response.text()
  } catch (e) {
    console.error('Gemini error:', e)
    return getFallbackChatResponse(userMessage)
  }
}

export async function generateWeeklyReport(weeklyData, userProfile) {
  const m = getModel()
  if (!m) return getFallbackWeeklyReport(weeklyData)

  const prompt = `${systemContext}

Generate a weekly sustainability report for ${userProfile.name}:
- Total CO₂ this week: ${weeklyData.totalCO2} kg
- vs last week: ${weeklyData.changePercent > 0 ? '+' : ''}${weeklyData.changePercent}%
- Habits completed: ${weeklyData.habitsCompleted}/${weeklyData.totalHabits}
- Top category: ${weeklyData.topCategory}
- Activities: ${weeklyData.activities?.join(', ') || 'None'}

Write a 4-sentence report with: 1) Overall performance, 2) What went well, 3) What needs improvement, 4) One specific goal for next week. Use bullet points starting with •.`

  try {
    const result = await m.generateContent(prompt)
    return result.response.text()
  } catch (e) {
    return getFallbackWeeklyReport(weeklyData)
  }
}

export async function generateMonthlyRoadmap(monthlyData, userProfile) {
  const m = getModel()
  if (!m) return getFallbackRoadmap()

  const prompt = `${systemContext}

Create a 4-week sustainability roadmap for ${userProfile.name} (${userProfile.location}):
- Current footprint: ${userProfile.totalCO2} kg/year
- Target: reduce by 20%
- Weakest area: ${monthlyData.weakestCategory}
- Strongest area: ${monthlyData.strongestCategory}

List exactly 4 weeks, each with a theme and 3 specific daily actions. Format:
Week 1 - [Theme]: action1 | action2 | action3
(same for weeks 2-4)`

  try {
    const result = await m.generateContent(prompt)
    return result.response.text()
  } catch (e) {
    return getFallbackRoadmap()
  }
}

// ─── Fallbacks (when no API key or quota exceeded) ────────────────────────────

function getFallbackInsight(profile) {
  const tips = [
    `Great progress! Your ${profile.totalCO2 || 0} kg CO₂/year is ${profile.totalCO2 < 2000 ? 'below' : 'above'} the global average of 4,700 kg. Your biggest opportunity is in ${profile.topCategory || 'transportation'} — switching to public transit just 3 days a week could cut your footprint by 15%. Try tomorrow: walk or cycle for any trip under 2km.`,
    `Your sustainability score of ${profile.sustainabilityScore || 50}/100 puts you in the top 30% of users in your region. To push into the top 10%, focus on your ${profile.topCategory || 'energy'} habits. Today's challenge: audit your home energy use and unplug 3 standby devices.`,
    `With a ${profile.currentStreak || 0}-day streak, you're building excellent eco-habits! Your current trajectory will save an estimated 120kg CO₂ this month. One powerful action for today: choose a plant-based lunch — it saves roughly 1.5kg CO₂ per meal versus a meat-based option.`,
  ]
  return tips[Math.floor(Math.random() * tips.length)]
}

function getFallbackChatResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('transport') || lower.includes('car') || lower.includes('commut')) {
    return 'Transportation is typically the largest source of personal emissions, averaging 30-40% of your total footprint. Switching from a petrol car to public transit for your daily commute can save 2.6 tonnes CO₂ per year. Even carpooling twice a week makes a measurable difference — consider checking if your company has a carpool program.'
  }
  if (lower.includes('food') || lower.includes('diet') || lower.includes('eat')) {
    return 'Food choices have a huge impact — a plant-based diet produces roughly 50% fewer greenhouse gas emissions than a meat-heavy diet. You don\'t need to go fully vegan; cutting beef specifically and replacing 3 meals per week with plant-based options can save around 300kg CO₂ annually. Local, seasonal produce also significantly reduces food-miles emissions.'
  }
  if (lower.includes('energy') || lower.includes('electricity') || lower.includes('home')) {
    return 'Home energy is usually the second-largest emission source. Switching to LED lighting saves 75% of lighting energy, while setting your AC 2°C higher (26°C vs 24°C) cuts cooling energy by about 15%. If you\'re in India, rooftop solar now has a 4-6 year payback period and qualifies for substantial government subsidies.'
  }
  return 'Every action you take to reduce your carbon footprint matters — and consistent small actions compound over time. Your current streak shows you\'re building real habits. Focus on your highest-emission category first for maximum impact, then layer in other changes gradually. What specific area would you like to work on today?'
}

function getFallbackWeeklyReport(data) {
  return `• Overall Performance: You emitted ${data?.totalCO2 || 'N/A'} kg CO₂ this week — ${data?.changePercent < 0 ? `a ${Math.abs(data.changePercent)}% improvement` : 'slightly above your target'}.
• What Went Well: You completed ${data?.habitsCompleted || 0} eco-habits and maintained consistency in your daily tracking.
• Needs Improvement: Your ${data?.topCategory || 'transportation'} emissions remain your largest source — focus here for the most impact.
• Next Week Goal: Aim to complete all 7 daily habits and reduce ${data?.topCategory || 'transport'} emissions by 10% through one concrete behavior change.`
}

function getFallbackRoadmap() {
  return `Week 1 - Transport Reset: Use public transit 3x | Map cycling routes | Track every commute
Week 2 - Energy Audit: Replace 5 bulbs with LED | Unplug standby devices | Read energy meter daily  
Week 3 - Food Footprint: Try 5 plant-based meals | Shop at local market | Reduce food waste by planning
Week 4 - Zero Waste Week: Carry reusable bags | Start composting | Refuse all single-use plastic`
}
