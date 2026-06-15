/**
 * Optional Vercel serverless function for the AI Climate Coach.
 *
 * When OPENAI_API_KEY is configured in the deployment environment this proxies
 * the user's question + a compact footprint summary to the OpenAI Chat
 * Completions API and returns a personalised reply. If no key is present (or
 * the upstream call fails) it responds with 503 so the frontend gracefully
 * falls back to its built-in rule-based engine.
 *
 * No extra dependencies required — uses the runtime's global `fetch`.
 */

const SYSTEM_PROMPT = `You are EcoTrack AI's Climate Coach, a friendly, concise sustainability assistant.
Give specific, actionable advice to reduce the user's carbon footprint based on the data provided.
Keep replies under 120 words, use plain language, and prefer concrete numbers and habits.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(503).json({ error: 'AI coach not configured' })
    return
  }

  try {
    const { message, context } = req.body || {}
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing message' })
      return
    }

    const userContent = `User question: ${message}\n\nFootprint summary (JSON): ${JSON.stringify(
      context || {},
    )}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.6,
        max_tokens: 220,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    })

    if (!response.ok) {
      res.status(502).json({ error: 'Upstream AI error' })
      return
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      res.status(502).json({ error: 'Empty AI response' })
      return
    }

    res.status(200).json({ reply })
  } catch {
    res.status(500).json({ error: 'Coach request failed' })
  }
}
