/**
 * Community challenges + daily eco habits used by the streak system and the
 * community / challenges pages.
 */

export const CHALLENGES = [
  {
    id: 'reduce-emissions',
    title: 'Reduce Emissions Challenge',
    description: 'Lower your monthly footprint by 15% this month.',
    category: 'emissions',
    points: 150,
    durationDays: 30,
    icon: '📉',
    participants: 18420,
  },
  {
    id: 'recycling',
    title: 'Recycling Challenge',
    description: 'Recycle every day for two weeks.',
    category: 'waste',
    points: 100,
    durationDays: 14,
    icon: '♻️',
    participants: 12950,
  },
  {
    id: 'public-transport',
    title: 'Public Transport Week',
    description: 'Swap your car for public transport for 7 days.',
    category: 'transport',
    points: 120,
    durationDays: 7,
    icon: '🚌',
    participants: 9870,
  },
  {
    id: 'tree-plantation',
    title: 'Tree Plantation Drive',
    description: 'Plant or sponsor 3 trees this season.',
    category: 'offset',
    points: 200,
    durationDays: 60,
    icon: '🌳',
    participants: 24310,
  },
  {
    id: 'meatless',
    title: 'Meatless Mondays',
    description: 'Go plant-based every Monday for a month.',
    category: 'food',
    points: 90,
    durationDays: 30,
    icon: '🥗',
    participants: 15600,
  },
]

/** Daily eco habits for the Green Streak system. */
export const DAILY_HABITS = [
  { id: 'recycle', label: 'Recycled today', icon: '♻️', points: 10 },
  { id: 'walk', label: 'Walked/cycled instead of driving', icon: '🚶', points: 15 },
  { id: 'electricity', label: 'Reduced electricity use', icon: '💡', points: 10 },
  { id: 'reusable', label: 'Used reusable products', icon: '🥤', points: 10 },
  { id: 'plant-based', label: 'Ate a plant-based meal', icon: '🥗', points: 12 },
  { id: 'water', label: 'Saved water', icon: '💧', points: 8 },
]

/** Synthetic leaderboard seed (used when no live data is present). */
export const LEADERBOARD_SEED = [
  { name: 'Aanya S.', country: 'IN', city: 'Bengaluru', points: 4820, score: 94 },
  { name: 'Lucas M.', country: 'BR', city: 'São Paulo', points: 4510, score: 91 },
  { name: 'Mei L.', country: 'CN', city: 'Shanghai', points: 4380, score: 89 },
  { name: 'Erik N.', country: 'SE', city: 'Stockholm', points: 4120, score: 93 },
  { name: 'Sofia R.', country: 'ES', city: 'Madrid', points: 3890, score: 88 },
  { name: 'James K.', country: 'GB', city: 'London', points: 3640, score: 86 },
  { name: 'Priya V.', country: 'IN', city: 'Mumbai', points: 3410, score: 90 },
  { name: 'Noah B.', country: 'US', city: 'San Francisco', points: 3200, score: 82 },
  { name: 'Wanjiru K.', country: 'KE', city: 'Nairobi', points: 3050, score: 96 },
  { name: 'Hiro T.', country: 'JP', city: 'Tokyo', points: 2900, score: 84 },
]
