/**
 * Coach chat service.
 *
 * Tries the optional serverless endpoint (/api/coach) which uses OpenAI when a
 * key is configured on the host. Falls back to the local rule-based engine so
 * the coach always works, even without a backend or API key.
 */
import { ruleBasedReply } from '../utils/coach'

export async function askCoach(message, context) {
  try {
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context: summarize(context) }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.reply) return { reply: data.reply, source: 'ai' }
    }
  } catch {
    // Network/endpoint unavailable — fall through to local engine.
  }
  return { reply: ruleBasedReply(message, context), source: 'local' }
}

/** Trim context to a compact summary for the LLM prompt. */
function summarize(context = {}) {
  const { entries = [], stats = {} } = context
  const latest = entries[entries.length - 1]
  return {
    latest: latest
      ? {
          total: latest.total,
          transport: latest.transport,
          energy: latest.energy,
          food: latest.food,
          waste: latest.waste,
          score: latest.score,
        }
      : null,
    entryCount: entries.length,
    points: stats.points || 0,
    currentStreak: stats.currentStreak || 0,
  }
}
