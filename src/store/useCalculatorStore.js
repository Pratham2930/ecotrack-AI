import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultInputs = {
  // Transportation
  carKmPerWeek: 0,
  busKmPerWeek: 0,
  trainKmPerWeek: 0,
  flightHoursPerYear: 0,
  bikeKmPerWeek: 0,
  // Home Energy
  electricityKwhPerMonth: 0,
  lpgCylindersPerMonth: 0,
  // Food
  dietType: 'omnivore', // vegan, vegetarian, eggetarian, omnivore
  // Waste
  plasticKgPerWeek: 0,
  paperKgPerWeek: 0,
  recyclingPercent: 0,
}

// Emission factors (kg CO2 per unit)
const factors = {
  carPerKm: 0.171,
  busPerKm: 0.089,
  trainPerKm: 0.041,
  flightPerHour: 255,
  bikePerKm: 0,
  electricityPerKwh: 0.716, // India grid
  lpgPerCylinder: 28.6,
  diet: { vegan: 0.5, vegetarian: 1.2, eggetarian: 1.7, omnivore: 2.5 }, // tonnes/year
  plasticPerKg: 6.0,
  paperPerKg: 0.94,
  recyclingBenefit: 0.3, // reduction factor
}

export const useCalculatorStore = create(
  persist(
    (set, get) => ({
      inputs: defaultInputs,
      results: null,
      lastCalculated: null,

      updateInput: (key, value) => {
        set(state => ({ inputs: { ...state.inputs, [key]: value } }))
      },

      calculate: () => {
        const { inputs } = get()

        // Transport (weekly → annual kg CO2)
        const transport = (
          inputs.carKmPerWeek * factors.carPerKm * 52 +
          inputs.busKmPerWeek * factors.busPerKm * 52 +
          inputs.trainKmPerWeek * factors.trainPerKm * 52 +
          inputs.flightHoursPerYear * factors.flightPerHour +
          inputs.bikeKmPerWeek * factors.bikePerKm * 52
        )

        // Energy (monthly → annual kg CO2)
        const energy = (
          inputs.electricityKwhPerMonth * factors.electricityPerKwh * 12 +
          inputs.lpgCylindersPerMonth * factors.lpgPerCylinder * 12
        )

        // Food (annual kg CO2)
        const food = factors.diet[inputs.dietType] * 1000

        // Waste (weekly → annual kg CO2)
        const wasteBase = (
          inputs.plasticKgPerWeek * factors.plasticPerKg * 52 +
          inputs.paperKgPerWeek * factors.paperPerKg * 52
        )
        const recyclingReduction = wasteBase * (inputs.recyclingPercent / 100) * factors.recyclingBenefit
        const waste = wasteBase - recyclingReduction

        const totalKg = transport + energy + food + waste
        const totalTonnes = totalKg / 1000

        const results = {
          transport: Math.round(transport),
          energy: Math.round(energy),
          food: Math.round(food),
          waste: Math.round(waste),
          totalKg: Math.round(totalKg),
          totalTonnes: parseFloat(totalTonnes.toFixed(2)),
          breakdown: [
            { name: 'Transportation', value: Math.round(transport), percent: Math.round((transport / totalKg) * 100) || 0 },
            { name: 'Home Energy', value: Math.round(energy), percent: Math.round((energy / totalKg) * 100) || 0 },
            { name: 'Food', value: Math.round(food), percent: Math.round((food / totalKg) * 100) || 0 },
            { name: 'Waste', value: Math.round(waste), percent: Math.round((waste / totalKg) * 100) || 0 },
          ],
          rating: totalTonnes < 2 ? 'Excellent' : totalTonnes < 4 ? 'Good' : totalTonnes < 7 ? 'Average' : totalTonnes < 10 ? 'High' : 'Very High',
          ratingColor: totalTonnes < 2 ? '#16a34a' : totalTonnes < 4 ? '#22c55e' : totalTonnes < 7 ? '#eab308' : totalTonnes < 10 ? '#f97316' : '#ef4444',
          vsIndiaAvg: Math.round(((1.9 - totalTonnes) / 1.9) * 100),
          vsGlobalAvg: Math.round(((4.7 - totalTonnes) / 4.7) * 100),
        }

        set({ results, lastCalculated: new Date().toISOString() })
        return results
      },

      reset: () => set({ inputs: defaultInputs, results: null }),
    }),
    { name: 'ecotrack-calculator' }
  )
)
