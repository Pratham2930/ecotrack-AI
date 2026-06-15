/**
 * Eco Impact Marketplace catalogue: sustainable alternatives with estimated
 * annual CO2 savings, sustainability ratings and sample reviews.
 */

export const PRODUCT_CATEGORIES = ['All', 'Home', 'Transport', 'Kitchen', 'Energy', 'Lifestyle']

export const PRODUCTS = [
  {
    id: 'steel-bottle',
    name: 'Reusable Steel Bottle',
    replaces: 'Single-use plastic bottles',
    category: 'Kitchen',
    annualCo2SavingKg: 36,
    sustainabilityScore: 92,
    price: 18,
    rating: 4.8,
    reviews: 1243,
    emoji: '🍶',
    impact: 'high',
    tags: ['waste'],
  },
  {
    id: 'ev-scooter',
    name: 'Electric Scooter',
    replaces: 'Petrol scooter',
    category: 'Transport',
    annualCo2SavingKg: 410,
    sustainabilityScore: 88,
    price: 1200,
    rating: 4.6,
    reviews: 642,
    emoji: '🛵',
    impact: 'high',
    tags: ['transport'],
  },
  {
    id: 'led-pack',
    name: 'LED Bulb Pack (6)',
    replaces: 'Incandescent bulbs',
    category: 'Energy',
    annualCo2SavingKg: 120,
    sustainabilityScore: 90,
    price: 24,
    rating: 4.9,
    reviews: 3098,
    emoji: '💡',
    impact: 'high',
    tags: ['energy'],
  },
  {
    id: 'reusable-bags',
    name: 'Reusable Cotton Bags (set)',
    replaces: 'Disposable plastic bags',
    category: 'Lifestyle',
    annualCo2SavingKg: 28,
    sustainabilityScore: 85,
    price: 15,
    rating: 4.7,
    reviews: 870,
    emoji: '🛍️',
    impact: 'medium',
    tags: ['waste'],
  },
  {
    id: 'solar-charger',
    name: 'Portable Solar Charger',
    replaces: 'Grid-powered charging',
    category: 'Energy',
    annualCo2SavingKg: 45,
    sustainabilityScore: 82,
    price: 60,
    rating: 4.3,
    reviews: 412,
    emoji: '🔆',
    impact: 'medium',
    tags: ['energy'],
  },
  {
    id: 'smart-thermostat',
    name: 'Smart Thermostat',
    replaces: 'Manual thermostat',
    category: 'Home',
    annualCo2SavingKg: 320,
    sustainabilityScore: 87,
    price: 130,
    rating: 4.5,
    reviews: 1560,
    emoji: '🌡️',
    impact: 'high',
    tags: ['energy'],
  },
  {
    id: 'compost-bin',
    name: 'Kitchen Compost Bin',
    replaces: 'Sending food waste to landfill',
    category: 'Kitchen',
    annualCo2SavingKg: 150,
    sustainabilityScore: 84,
    price: 35,
    rating: 4.4,
    reviews: 530,
    emoji: '🪴',
    impact: 'high',
    tags: ['waste'],
  },
  {
    id: 'bamboo-toothbrush',
    name: 'Bamboo Toothbrush (4)',
    replaces: 'Plastic toothbrushes',
    category: 'Lifestyle',
    annualCo2SavingKg: 5,
    sustainabilityScore: 78,
    price: 9,
    rating: 4.6,
    reviews: 2210,
    emoji: '🪥',
    impact: 'low',
    tags: ['waste'],
  },
  {
    id: 'bike',
    name: 'Commuter Bicycle',
    replaces: 'Short car trips',
    category: 'Transport',
    annualCo2SavingKg: 280,
    sustainabilityScore: 95,
    price: 350,
    rating: 4.8,
    reviews: 1890,
    emoji: '🚲',
    impact: 'high',
    tags: ['transport'],
  },
  {
    id: 'wool-dryer-balls',
    name: 'Wool Dryer Balls',
    replaces: 'Dryer sheets + long dry cycles',
    category: 'Home',
    annualCo2SavingKg: 40,
    sustainabilityScore: 80,
    price: 14,
    rating: 4.5,
    reviews: 990,
    emoji: '🧺',
    impact: 'medium',
    tags: ['energy'],
  },
]

/**
 * Recommend products based on a user's footprint breakdown.
 * Categories with higher emissions surface their matching products first.
 */
export function recommendProducts(footprint) {
  if (!footprint) return PRODUCTS.slice(0, 4)
  const weights = {
    transport: footprint.transport || 0,
    energy: footprint.energy || 0,
    waste: footprint.waste || 0,
  }
  return [...PRODUCTS]
    .map((p) => {
      const tag = p.tags[0]
      return { ...p, _weight: (weights[tag] || 0) + p.annualCo2SavingKg / 50 }
    })
    .sort((a, b) => b._weight - a._weight)
}
