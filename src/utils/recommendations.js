/**
 * Rule-based recommendation engine.
 * Analyses a user's footprint breakdown + raw inputs and produces a ranked,
 * personalised list of carbon reduction actions with estimated savings.
 */
import { TRANSPORT_FACTORS, ENERGY_FACTORS, calcTransport } from './carbon'

/**
 * @param {object} footprint result of calculateFootprint()
 * @param {object} inputs the raw calculator inputs { transport, energy, diet, waste }
 * @returns {Array<{id,title,detail,category,impact,savingKg}>}
 */
export function generateRecommendations(footprint, inputs = {}) {
  const recs = []
  const t = inputs.transport || {}
  const e = inputs.energy || {}
  const w = inputs.waste || {}

  // Transport: car travel
  const carKm = Number(t.car) || 0
  if (carKm > 100) {
    const saving = calcTransport({ car: carKm * 0.2 })
    recs.push({
      id: 'car-reduce',
      title: 'Reduce car travel by 20%',
      detail: `You drive ~${Math.round(carKm)} km/month. Cutting 20% via carpooling or remote work saves CO₂.`,
      category: 'transport',
      savingKg: saving,
    })
  }
  if (carKm > 50 && (Number(t.bus) || 0) + (Number(t.train) || 0) < carKm * 0.3) {
    const saving =
      calcTransport({ car: carKm * 0.3 }) - calcTransport({ train: carKm * 0.3 })
    recs.push({
      id: 'public-transport',
      title: 'Use public transportation',
      detail: 'Shift ~30% of your car trips to train or bus to cut transport emissions significantly.',
      category: 'transport',
      savingKg: Math.max(0, saving),
    })
  }
  if ((Number(t.flight) || 0) > 500) {
    recs.push({
      id: 'fewer-flights',
      title: 'Consider fewer flights',
      detail: 'Flights are carbon-intensive. Replace one trip with rail or virtual meetings where possible.',
      category: 'transport',
      savingKg: Number(t.flight) * TRANSPORT_FACTORS.flight * 0.25,
    })
  }

  // Energy
  const kwh = Number(e.electricity) || 0
  if (kwh > 200) {
    recs.push({
      id: 'led-bulbs',
      title: 'Switch to LED bulbs',
      detail: 'Replacing incandescent bulbs with LEDs can cut lighting energy use by up to 80%.',
      category: 'energy',
      savingKg: kwh * 0.1 * ENERGY_FACTORS.electricity,
    })
    recs.push({
      id: 'energy-efficient',
      title: 'Lower electricity consumption by 10%',
      detail: 'Unplug idle devices and optimise heating/cooling to trim ~10% of your usage.',
      category: 'energy',
      savingKg: kwh * 0.1 * ENERGY_FACTORS.electricity,
    })
  }

  // Diet
  if (inputs.diet === 'nonveg') {
    recs.push({
      id: 'plant-based',
      title: 'Add more plant-based meals',
      detail: 'Swapping a few meat meals each week for vegetarian options noticeably lowers food emissions.',
      category: 'food',
      savingKg: 24,
    })
  } else if (inputs.diet === 'eggetarian') {
    recs.push({
      id: 'plant-based-veg',
      title: 'Lean further into plant-based eating',
      detail: 'Moving toward a fully vegetarian or vegan diet reduces your monthly food footprint.',
      category: 'food',
      savingKg: 24,
    })
  }

  // Waste / recycling
  const recyclingRate = Number(w.recyclingRate) || 0
  if (recyclingRate < 50 && ((Number(w.plastic) || 0) + (Number(w.paper) || 0)) > 0) {
    recs.push({
      id: 'increase-recycling',
      title: 'Increase recycling',
      detail: `Your recycling rate is ${Math.round(recyclingRate)}%. Recycling more plastic and paper directly cuts waste emissions.`,
      category: 'waste',
      savingKg: footprint?.waste ? footprint.waste * 0.3 : 5,
    })
  }
  if ((Number(w.plastic) || 0) > 2) {
    recs.push({
      id: 'reduce-plastic',
      title: 'Cut single-use plastic',
      detail: 'Switch to reusable bottles and bags to reduce plastic waste at the source.',
      category: 'waste',
      savingKg: (Number(w.plastic) || 0) * 0.4 * 6,
    })
  }

  // Default encouragement when footprint is already low.
  if (recs.length === 0) {
    recs.push({
      id: 'maintain',
      title: 'Great job — keep it up!',
      detail: 'Your footprint is already low. Maintain your habits and inspire others to join in.',
      category: 'general',
      savingKg: 0,
    })
  }

  return recs
    .map((r) => ({ ...r, savingKg: Math.round((r.savingKg + Number.EPSILON) * 10) / 10, impact: impactLevel(r.savingKg) }))
    .sort((a, b) => b.savingKg - a.savingKg)
}

function impactLevel(savingKg) {
  if (savingKg >= 40) return 'high'
  if (savingKg >= 15) return 'medium'
  return 'low'
}
