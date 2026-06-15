export const globalBenchmarks = {
  worldAverage: 4.7,
  indiaAverage: 1.9,
  usaAverage: 14.5,
  europeAverage: 7.2,
  chinaAverage: 8.1,
  australiaAverage: 15.2,
  userValue: 3.8,
}

export const countryData = [
  { country: 'Qatar', code: 'QA', emissions: 31.4, rank: 1, population: 2.9, color: '#ef4444' },
  { country: 'Kuwait', code: 'KW', emissions: 25.6, rank: 2, population: 4.3, color: '#f97316' },
  { country: 'UAE', code: 'AE', emissions: 20.3, rank: 3, population: 9.9, color: '#f97316' },
  { country: 'Australia', code: 'AU', emissions: 15.2, rank: 4, population: 26.1, color: '#eab308' },
  { country: 'USA', code: 'US', emissions: 14.5, rank: 5, population: 331, color: '#eab308' },
  { country: 'Canada', code: 'CA', emissions: 13.6, rank: 6, population: 38.4, color: '#eab308' },
  { country: 'Russia', code: 'RU', emissions: 11.4, rank: 7, population: 143, color: '#84cc16' },
  { country: 'Japan', code: 'JP', emissions: 9.0, rank: 8, population: 125, color: '#84cc16' },
  { country: 'China', code: 'CN', emissions: 8.1, rank: 9, population: 1400, color: '#84cc16' },
  { country: 'Germany', code: 'DE', emissions: 7.9, rank: 10, population: 83.8, color: '#84cc16' },
  { country: 'UK', code: 'GB', emissions: 5.6, rank: 11, population: 67.9, color: '#22c55e' },
  { country: 'Brazil', code: 'BR', emissions: 2.7, rank: 12, population: 214, color: '#22c55e' },
  { country: 'India', code: 'IN', emissions: 1.9, rank: 13, population: 1400, color: '#16a34a' },
  { country: 'Indonesia', code: 'ID', emissions: 1.8, rank: 14, population: 273, color: '#16a34a' },
  { country: 'Ethiopia', code: 'ET', emissions: 0.1, rank: 15, population: 117, color: '#15803d' },
]

export const cityComparisons = [
  { city: 'Mumbai', country: 'India', emissions: 1.4, rank: 3, percentile: 85 },
  { city: 'Delhi', country: 'India', emissions: 2.1, rank: 12, percentile: 74 },
  { city: 'Bangalore', country: 'India', emissions: 1.6, rank: 5, percentile: 82 },
  { city: 'Chennai', country: 'India', emissions: 1.3, rank: 2, percentile: 88 },
  { city: 'Pune', country: 'India', emissions: 1.5, rank: 4, percentile: 84 },
]

export const userInsights = [
  { insight: 'You emit 30% less CO₂ than the average user in India.', type: 'positive', icon: '🎉' },
  { insight: 'Your transportation emissions are 15% higher than city average.', type: 'warning', icon: '⚠️' },
  { insight: 'You are in the top 15% globally for food sustainability.', type: 'positive', icon: '🌱' },
  { insight: 'Your home energy usage is on par with the India average.', type: 'neutral', icon: '📊' },
]

export const percentileData = [
  { label: 'Global', percentile: 72, description: 'Better than 72% of global users' },
  { label: 'India', percentile: 85, description: 'Better than 85% in India' },
  { label: 'Mumbai', percentile: 78, description: 'Better than 78% in Mumbai' },
  { label: 'Your Age Group', percentile: 81, description: 'Better than 81% in your age group' },
]
