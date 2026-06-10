/**
 * Reference dataset of per-capita carbon emissions and sustainability metrics.
 * Values are approximate, derived from public datasets (Our World in Data,
 * IEA renewable share). Used for global benchmarking and the world map.
 *
 * perCapitaAnnualT: tonnes CO2 per person per year
 * renewablePct: share of electricity from renewables (%)
 * monthlyAvgKg: derived average lifestyle footprint (kg CO2e/month)
 */

function withDerived(rows) {
  return rows.map((r) => {
    const monthlyAvgKg = Math.round((r.perCapitaAnnualT * 1000) / 12)
    // Sustainability score: reward low emissions + high renewables.
    const emissionScore = Math.max(0, 100 - (r.perCapitaAnnualT / 18) * 100)
    const sustainabilityScore = Math.round(emissionScore * 0.7 + r.renewablePct * 0.3)
    return { ...r, monthlyAvgKg, sustainabilityScore }
  })
}

export const COUNTRIES = withDerived([
  { code: 'IN', name: 'India', flag: '🇮🇳', lat: 22.35, lng: 78.66, perCapitaAnnualT: 1.9, renewablePct: 22 },
  { code: 'US', name: 'United States', flag: '🇺🇸', lat: 39.5, lng: -98.35, perCapitaAnnualT: 14.4, renewablePct: 21 },
  { code: 'CN', name: 'China', flag: '🇨🇳', lat: 35.86, lng: 104.2, perCapitaAnnualT: 7.4, renewablePct: 30 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', lat: -14.24, lng: -51.93, perCapitaAnnualT: 2.2, renewablePct: 83 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', lat: 51.17, lng: 10.45, perCapitaAnnualT: 8.1, renewablePct: 46 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lat: 55.38, lng: -3.44, perCapitaAnnualT: 5.2, renewablePct: 43 },
  { code: 'FR', name: 'France', flag: '🇫🇷', lat: 46.23, lng: 2.21, perCapitaAnnualT: 4.7, renewablePct: 25 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', lat: 36.2, lng: 138.25, perCapitaAnnualT: 8.5, renewablePct: 22 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', lat: 56.13, lng: -106.35, perCapitaAnnualT: 14.2, renewablePct: 68 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', lat: -25.27, lng: 133.78, perCapitaAnnualT: 15.1, renewablePct: 35 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', lat: 61.52, lng: 105.32, perCapitaAnnualT: 11.4, renewablePct: 20 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', lat: -30.56, lng: 22.94, perCapitaAnnualT: 7.0, renewablePct: 12 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', lat: 60.13, lng: 18.64, perCapitaAnnualT: 3.6, renewablePct: 69 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', lat: 60.47, lng: 8.47, perCapitaAnnualT: 6.9, renewablePct: 98 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', lat: -0.02, lng: 37.91, perCapitaAnnualT: 0.4, renewablePct: 90 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', lat: 23.63, lng: -102.55, perCapitaAnnualT: 3.6, renewablePct: 24 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', lat: -0.79, lng: 113.92, perCapitaAnnualT: 2.3, renewablePct: 19 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', lat: 23.42, lng: 53.85, perCapitaAnnualT: 20.0, renewablePct: 7 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', lat: 40.46, lng: -3.75, perCapitaAnnualT: 4.9, renewablePct: 44 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', lat: 41.87, lng: 12.57, perCapitaAnnualT: 5.2, renewablePct: 41 },
])

export const GLOBAL_AVG = (() => {
  const monthly = Math.round(
    COUNTRIES.reduce((s, c) => s + c.monthlyAvgKg, 0) / COUNTRIES.length,
  )
  const renewable = Math.round(
    COUNTRIES.reduce((s, c) => s + c.renewablePct, 0) / COUNTRIES.length,
  )
  const score = Math.round(
    COUNTRIES.reduce((s, c) => s + c.sustainabilityScore, 0) / COUNTRIES.length,
  )
  return { monthlyAvgKg: monthly, renewablePct: renewable, sustainabilityScore: score }
})()

/** City-level averages (kg CO2e/month) for finer benchmarking. */
export const CITIES = [
  { city: 'Mumbai', country: 'IN', monthlyAvgKg: 180 },
  { city: 'Delhi', country: 'IN', monthlyAvgKg: 210 },
  { city: 'Bengaluru', country: 'IN', monthlyAvgKg: 165 },
  { city: 'New York', country: 'US', monthlyAvgKg: 1180 },
  { city: 'San Francisco', country: 'US', monthlyAvgKg: 920 },
  { city: 'London', country: 'GB', monthlyAvgKg: 440 },
  { city: 'Berlin', country: 'DE', monthlyAvgKg: 620 },
  { city: 'Tokyo', country: 'JP', monthlyAvgKg: 690 },
  { city: 'Sydney', country: 'AU', monthlyAvgKg: 1250 },
  { city: 'Stockholm', country: 'SE', monthlyAvgKg: 290 },
  { city: 'São Paulo', country: 'BR', monthlyAvgKg: 195 },
  { city: 'Nairobi', country: 'KE', monthlyAvgKg: 45 },
]

export function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code) || null
}
