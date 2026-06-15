/**
 * Helpers to transform raw footprint entries into chart-ready series.
 */
import { sustainabilityScore } from './carbon'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Group entries by calendar month, averaging totals + categories. */
export function monthlySeries(entries = []) {
  const buckets = new Map()
  for (const e of entries) {
    const d = new Date(e.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label: `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
        total: 0,
        transport: 0,
        energy: 0,
        food: 0,
        waste: 0,
        count: 0,
      })
    }
    const b = buckets.get(key)
    b.total += e.total || 0
    b.transport += e.transport || 0
    b.energy += e.energy || 0
    b.food += e.food || 0
    b.waste += e.waste || 0
    b.count += 1
  }
  return [...buckets.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((b) => {
      const avg = (v) => Math.round((v / b.count) * 10) / 10
      const total = avg(b.total)
      return {
        label: b.label,
        total,
        transport: avg(b.transport),
        energy: avg(b.energy),
        food: avg(b.food),
        waste: avg(b.waste),
        score: sustainabilityScore(total),
      }
    })
}

/** Category totals for the most recent entry (for pie chart). */
export function categoryBreakdown(entry) {
  if (!entry) return []
  return [
    { name: 'Transport', value: entry.transport || 0, color: '#10b981' },
    { name: 'Energy', value: entry.energy || 0, color: '#f59e0b' },
    { name: 'Food', value: entry.food || 0, color: '#f43f5e' },
    { name: 'Waste', value: entry.waste || 0, color: '#0ea5e9' },
  ].filter((c) => c.value > 0)
}

/** Percentage change between the last two entries (negative = improvement). */
export function trendChange(entries = []) {
  if (entries.length < 2) return null
  const prev = entries[entries.length - 2].total || 0
  const curr = entries[entries.length - 1].total || 0
  if (prev === 0) return null
  return Math.round(((curr - prev) / prev) * 100)
}
