export const countrySustainabilityData = [
  { name: 'India', lat: 20.5937, lng: 78.9629, score: 76, emissions: 1.9, rank: 12, population: 1400, renewable: 42, trend: 'improving' },
  { name: 'China', lat: 35.8617, lng: 104.1954, score: 52, emissions: 8.1, rank: 7, population: 1400, renewable: 29, trend: 'improving' },
  { name: 'USA', lat: 37.0902, lng: -95.7129, score: 38, emissions: 14.5, rank: 3, population: 331, renewable: 22, trend: 'stable' },
  { name: 'Germany', lat: 51.1657, lng: 10.4515, score: 65, emissions: 7.9, rank: 8, population: 83.8, renewable: 46, trend: 'improving' },
  { name: 'Brazil', lat: -14.235, lng: -51.9253, score: 72, emissions: 2.7, rank: 11, population: 214, renewable: 83, trend: 'stable' },
  { name: 'UK', lat: 55.3781, lng: -3.436, score: 61, emissions: 5.6, rank: 9, population: 67.9, renewable: 43, trend: 'improving' },
  { name: 'Japan', lat: 36.2048, lng: 138.2529, score: 55, emissions: 9.0, rank: 6, population: 125, renewable: 20, trend: 'stable' },
  { name: 'Australia', lat: -25.2744, lng: 133.7751, score: 34, emissions: 15.2, rank: 2, population: 26.1, renewable: 28, trend: 'improving' },
  { name: 'Canada', lat: 56.1304, lng: -106.3468, score: 36, emissions: 13.6, rank: 4, population: 38.4, renewable: 67, trend: 'stable' },
  { name: 'France', lat: 46.2276, lng: 2.2137, score: 67, emissions: 5.2, rank: 10, population: 67.7, renewable: 20, trend: 'stable' },
  { name: 'Norway', lat: 60.472, lng: 8.4689, score: 88, emissions: 7.5, rank: 14, population: 5.4, renewable: 98, trend: 'improving' },
  { name: 'Denmark', lat: 56.2639, lng: 9.5018, score: 84, emissions: 5.8, rank: 13, population: 5.9, renewable: 80, trend: 'improving' },
  { name: 'Ethiopia', lat: 9.145, lng: 40.4897, score: 91, emissions: 0.1, rank: 15, population: 117, renewable: 91, trend: 'stable' },
  { name: 'Sweden', lat: 60.1282, lng: 18.6435, score: 86, emissions: 3.5, rank: 15, population: 10.4, renewable: 54, trend: 'improving' },
  { name: 'Russia', lat: 61.524, lng: 105.3188, score: 29, emissions: 11.4, rank: 5, population: 143, renewable: 18, trend: 'declining' },
]

export const getScoreColor = (score) => {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#22c55e'
  if (score >= 40) return '#eab308'
  if (score >= 20) return '#f97316'
  return '#ef4444'
}

export const getEmissionsColor = (emissions) => {
  if (emissions <= 2) return '#16a34a'
  if (emissions <= 5) return '#22c55e'
  if (emissions <= 8) return '#eab308'
  if (emissions <= 12) return '#f97316'
  return '#ef4444'
}
