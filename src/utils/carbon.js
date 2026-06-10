/**
 * Carbon calculation engine.
 *
 * All emission factors are expressed in kilograms of CO2-equivalent (kg CO2e)
 * and sourced from widely cited public datasets (DEFRA / EPA / IPCC averages).
 * Inputs are treated as MONTHLY values unless otherwise noted.
 */

// kg CO2e per kilometre travelled.
export const TRANSPORT_FACTORS = {
  car: 0.192, // average petrol passenger car
  bike: 0.103, // petrol two-wheeler / motorbike
  bus: 0.105, // local diesel bus per passenger
  train: 0.041, // national rail per passenger
  flight: 0.18, // short-haul economy per passenger
}

// Home energy factors.
export const ENERGY_FACTORS = {
  electricity: 0.475, // kg CO2e per kWh (global grid average)
  lpg: 2.983, // kg CO2e per kg of LPG burned
}

// Monthly dietary footprint by diet type (kg CO2e/month), derived from
// average daily dietary emissions * 30 days.
export const DIET_FACTORS = {
  vegan: 1.5 * 30, // 45
  vegetarian: 1.7 * 30, // 51
  eggetarian: 2.5 * 30, // 75
  nonveg: 3.3 * 30, // 99
}

export const DIET_LABELS = {
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  eggetarian: 'Eggetarian',
  nonveg: 'Non-Vegetarian',
}

// Waste factors (kg CO2e per kg of waste).
export const WASTE_FACTORS = {
  plastic: 6.0,
  paper: 1.3,
}

// Reference monthly footprints used to normalise the sustainability score.
export const FOOTPRINT_HIGH_REF = 2000 // very high emitter => score 0
export const FOOTPRINT_LOW_REF = 100 // near-ideal emitter => score 100

// Offset constants.
export const KG_CO2_PER_TREE_YEAR = 21 // a mature tree absorbs ~21 kg CO2/year
export const GASOLINE_KG_PER_LITRE = 2.31
export const SMARTPHONE_CHARGE_KG = 0.00822

const num = (v) => {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return Number.isFinite(n) && n > 0 ? n : 0
}

const round = (v, dp = 2) => {
  const f = 10 ** dp
  return Math.round((v + Number.EPSILON) * f) / f
}

/**
 * Calculate transportation emissions (kg CO2e/month).
 * @param {object} t monthly distances in km { car, bike, bus, train, flight }
 */
export function calcTransport(t = {}) {
  return round(
    num(t.car) * TRANSPORT_FACTORS.car +
      num(t.bike) * TRANSPORT_FACTORS.bike +
      num(t.bus) * TRANSPORT_FACTORS.bus +
      num(t.train) * TRANSPORT_FACTORS.train +
      num(t.flight) * TRANSPORT_FACTORS.flight,
  )
}

/**
 * Calculate home energy emissions (kg CO2e/month).
 * @param {object} e { electricity (kWh), lpg (kg) }
 */
export function calcEnergy(e = {}) {
  return round(
    num(e.electricity) * ENERGY_FACTORS.electricity + num(e.lpg) * ENERGY_FACTORS.lpg,
  )
}

/**
 * Calculate dietary emissions (kg CO2e/month).
 * @param {string} diet one of vegan|vegetarian|eggetarian|nonveg
 */
export function calcFood(diet) {
  return round(DIET_FACTORS[diet] ?? 0)
}

/**
 * Calculate waste emissions (kg CO2e/month).
 * Recycling reduces emissions by up to 50% at 100% recycling rate.
 * @param {object} w { plastic (kg), paper (kg), recyclingRate (0-100) }
 */
export function calcWaste(w = {}) {
  const gross = num(w.plastic) * WASTE_FACTORS.plastic + num(w.paper) * WASTE_FACTORS.paper
  const recyclingRate = Math.min(100, Math.max(0, num(w.recyclingRate)))
  const reduction = (recyclingRate / 100) * 0.5
  return round(gross * (1 - reduction))
}

/**
 * Full footprint calculation returning per-category breakdown and total.
 * @param {object} data { transport, energy, diet, waste }
 * @returns {{ transport:number, energy:number, food:number, waste:number, total:number, breakdown:Array }}
 */
export function calculateFootprint(data = {}) {
  const transport = calcTransport(data.transport)
  const energy = calcEnergy(data.energy)
  const food = calcFood(data.diet)
  const waste = calcWaste(data.waste)
  const total = round(transport + energy + food + waste)

  const breakdown = [
    { key: 'transport', label: 'Transportation', value: transport },
    { key: 'energy', label: 'Home Energy', value: energy },
    { key: 'food', label: 'Food', value: food },
    { key: 'waste', label: 'Waste', value: waste },
  ]

  return { transport, energy, food, waste, total, breakdown }
}

/**
 * Sustainability score 0-100 (higher is better, i.e. lower emissions).
 * @param {number} totalMonthly kg CO2e/month
 */
export function sustainabilityScore(totalMonthly) {
  const total = num(totalMonthly)
  if (total <= FOOTPRINT_LOW_REF) return 100
  if (total >= FOOTPRINT_HIGH_REF) return 0
  const score =
    ((FOOTPRINT_HIGH_REF - total) / (FOOTPRINT_HIGH_REF - FOOTPRINT_LOW_REF)) * 100
  return Math.round(Math.min(100, Math.max(0, score)))
}

/** Map a score to a qualitative rating + colour token. */
export function scoreRating(score) {
  if (score >= 80) return { label: 'Excellent', tone: 'eco' }
  if (score >= 60) return { label: 'Good', tone: 'lime' }
  if (score >= 40) return { label: 'Fair', tone: 'amber' }
  if (score >= 20) return { label: 'Poor', tone: 'orange' }
  return { label: 'Critical', tone: 'red' }
}

/**
 * Carbon offset equivalences for a given amount of CO2.
 * @param {number} totalMonthly kg CO2e/month
 */
export function offsetEquivalents(totalMonthly) {
  const monthly = num(totalMonthly)
  const annual = monthly * 12
  return {
    monthlyKg: round(monthly),
    annualKg: round(annual),
    treesNeeded: Math.ceil(annual / KG_CO2_PER_TREE_YEAR),
    carKm: Math.round(monthly / TRANSPORT_FACTORS.car),
    gasolineLitres: Math.round(monthly / GASOLINE_KG_PER_LITRE),
    smartphoneCharges: Math.round(monthly / SMARTPHONE_CHARGE_KG),
    flightKm: Math.round(monthly / TRANSPORT_FACTORS.flight),
  }
}

/** Format a kg value into a human friendly string. */
export function formatKg(value) {
  const v = num(value)
  if (v >= 1000) return `${round(v / 1000, 2)} t`
  return `${round(v, 1)} kg`
}

export { round as roundNumber, num as toPositiveNumber }
