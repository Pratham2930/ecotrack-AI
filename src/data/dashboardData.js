export const emissionsTrend = [
  { month: 'Jul', emissions: 5.2, target: 4.5, avg: 5.8 },
  { month: 'Aug', emissions: 4.9, target: 4.3, avg: 5.8 },
  { month: 'Sep', emissions: 4.7, target: 4.1, avg: 5.7 },
  { month: 'Oct', emissions: 4.4, target: 3.9, avg: 5.6 },
  { month: 'Nov', emissions: 4.1, target: 3.7, avg: 5.5 },
  { month: 'Dec', emissions: 3.9, target: 3.5, avg: 5.4 },
  { month: 'Jan', emissions: 4.2, target: 3.3, avg: 5.3 },
  { month: 'Feb', emissions: 3.8, target: 3.1, avg: 5.2 },
  { month: 'Mar', emissions: 3.6, target: 2.9, avg: 5.1 },
  { month: 'Apr', emissions: 3.5, target: 2.7, avg: 5.0 },
  { month: 'May', emissions: 3.2, target: 2.5, avg: 4.9 },
  { month: 'Jun', emissions: 3.0, target: 2.3, avg: 4.8 },
]

export const categoryBreakdown = [
  { name: 'Transportation', value: 35, color: '#22c55e', icon: '🚗' },
  { name: 'Home Energy', value: 28, color: '#14b8a6', icon: '🏠' },
  { name: 'Food', value: 22, color: '#3b82f6', icon: '🍽️' },
  { name: 'Waste', value: 10, color: '#f59e0b', icon: '♻️' },
  { name: 'Other', value: 5, color: '#8b5cf6', icon: '📦' },
]

export const reductionProgress = [
  { category: 'Transportation', current: 35, target: 25, reduction: 28.6 },
  { category: 'Home Energy', current: 28, target: 20, reduction: 28.5 },
  { category: 'Food', current: 22, target: 18, reduction: 18.2 },
  { category: 'Waste', current: 10, target: 6, reduction: 40.0 },
]

export const sustainabilityScoreTrend = [
  { month: 'Jul', score: 58 },
  { month: 'Aug', score: 62 },
  { month: 'Sep', score: 65 },
  { month: 'Oct', score: 68 },
  { month: 'Nov', score: 70 },
  { month: 'Dec', score: 72 },
  { month: 'Jan', score: 70 },
  { month: 'Feb', score: 74 },
  { month: 'Mar', score: 77 },
  { month: 'Apr', score: 79 },
  { month: 'May', score: 81 },
  { month: 'Jun', score: 82 },
]

export const dailyActivities = [
  { id: 1, activity: 'Took public transport', category: 'Transport', co2Saved: 2.4, time: '08:30 AM', icon: '🚌', points: 15 },
  { id: 2, activity: 'Vegetarian lunch', category: 'Food', co2Saved: 1.2, time: '01:00 PM', icon: '🥗', points: 10 },
  { id: 3, activity: 'Recycled paper waste', category: 'Waste', co2Saved: 0.5, time: '03:00 PM', icon: '♻️', points: 8 },
  { id: 4, activity: 'Used LED lighting', category: 'Energy', co2Saved: 0.3, time: '07:00 PM', icon: '💡', points: 5 },
  { id: 5, activity: 'Walked 2km instead of driving', category: 'Transport', co2Saved: 0.8, time: '09:00 AM', icon: '🚶', points: 12 },
]

export const weeklyStats = {
  co2Saved: 14.8,
  activitiesCompleted: 27,
  streakDays: 14,
  pointsEarned: 340,
  vsLastWeek: { co2Saved: 12, activitiesCompleted: -4, pointsEarned: 18 },
}
