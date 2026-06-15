import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { IoCalculator, IoArrowForward, IoArrowBack, IoSave, IoCheckmarkCircle } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { saveCalculation, updateCountryStats } from '../services/firestoreService'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

const COLORS = ['#22c55e', '#14b8a6', '#3b82f6', '#f59e0b']

const FACTORS = {
  carPerKm: 0.171, busPerKm: 0.089, trainPerKm: 0.041, flightPerHour: 255,
  electricityPerKwh: 0.716, lpgPerCylinder: 28.6,
  diet: { vegan: 500, vegetarian: 1200, eggetarian: 1700, omnivore: 2500 },
  plasticPerKg: 6.0, paperPerKg: 0.94,
}

function calcEmissions(inputs) {
  const transport = (inputs.carKm * FACTORS.carPerKm + inputs.busKm * FACTORS.busPerKm +
    inputs.trainKm * FACTORS.trainPerKm) * 52 + inputs.flightHrs * FACTORS.flightPerHour
  const energy = (inputs.electricity * FACTORS.electricityPerKwh + inputs.lpg * FACTORS.lpgPerCylinder) * 12
  const food = FACTORS.diet[inputs.diet] || 2500
  const wasteBase = (inputs.plastic * FACTORS.plasticPerKg + inputs.paper * FACTORS.paperPerKg) * 52
  const waste = wasteBase * (1 - (inputs.recycling / 100) * 0.3)
  const total = transport + energy + food + waste
  return {
    transport: Math.round(transport), energy: Math.round(energy),
    food: Math.round(food), waste: Math.round(waste),
    totalKg: Math.round(total), totalTonnes: parseFloat((total / 1000).toFixed(2)),
    breakdown: [
      { name: 'Transport', value: Math.round((transport / total) * 100) || 0 },
      { name: 'Energy', value: Math.round((energy / total) * 100) || 0 },
      { name: 'Food', value: Math.round((food / total) * 100) || 0 },
      { name: 'Waste', value: Math.round((waste / total) * 100) || 0 },
    ],
    rating: total < 2000 ? 'Excellent' : total < 4000 ? 'Good' : total < 7000 ? 'Average' : 'High',
    vsGlobal: parseFloat((((4700 - total / 1000) / 4700) * 100).toFixed(1)),
    vsIndia: parseFloat((((1900 - total / 1000) / 1900) * 100).toFixed(1)),
    sustainabilityScore: Math.max(0, Math.min(100, Math.round(100 - (total / 70)))),
  }
}

function Slider({ label, icon, value, max, unit, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-300 flex items-center gap-2">{icon} {label}</label>
        <span className="stat-number text-sm font-medium text-eco-400">{value} {unit}</span>
      </div>
      <input type="range" min={0} max={max} value={value}
        step={max > 100 ? 10 : 1} onChange={e => onChange(Number(e.target.value))}
        className="w-full" aria-label={label} />
    </div>
  )
}

const steps = [
  { title: 'Transportation', icon: '🚗' },
  { title: 'Home Energy', icon: '🏠' },
  { title: 'Food', icon: '🍽️' },
  { title: 'Waste', icon: '♻️' },
]

const defaultInputs = { carKm: 0, busKm: 0, trainKm: 0, flightHrs: 0, electricity: 0, lpg: 0, diet: 'omnivore', plastic: 0, paper: 0, recycling: 0 }

export default function Calculator() {
  const [step, setStep] = useState(0)
  const [inputs, setInputs] = useState(defaultInputs)
  const [results, setResults] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { user, profile } = useAuthStore()

  const set = (k, v) => setInputs(prev => ({ ...prev, [k]: v }))

  const handleCalculate = () => setResults(calcEmissions(inputs))

  const handleSave = async () => {
    if (!user || !results) return
    setSaving(true)
    try {
      await saveCalculation(user.uid, {
        ...results, ...inputs,
        userName: profile?.name || 'User',
        userPhoto: profile?.photoURL || '',
        country: profile?.country || 'India',
        city: profile?.city || 'Mumbai',
        ecoPoints: profile?.ecoPoints || 0,
      })
      await updateCountryStats(profile?.country || 'India', profile?.city, results.totalTonnes)
      setSaved(true)
      toast.success('Calculation saved to Firestore! 📊')
    } catch (e) {
      toast.error('Save failed: ' + e.message)
    }
    setSaving(false)
  }

  const reset = () => { setResults(null); setInputs(defaultInputs); setStep(0); setSaved(false) }

  const ratingColor = { Excellent: '#22c55e', Good: '#84cc16', Average: '#f59e0b', High: '#ef4444' }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoCalculator className="text-eco-400" /> Carbon Footprint Calculator
        </h1>
        <p className="text-slate-500 text-sm mt-1">Results save to Firestore and update your dashboard in real-time.</p>
      </motion.div>

      {!results ? (
        <>
          {/* Steps */}
          <div className="flex items-center gap-2 mb-7">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <button onClick={() => setStep(i)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${i === step ? 'text-white' : i < step ? 'bg-eco-500/20 text-eco-400' : 'bg-white/5 text-slate-600'}`}
                  style={i === step ? { background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 0 12px rgba(34,197,94,0.4)' } : {}}
                  aria-label={s.title}>
                  {i < step ? '✓' : i + 1}
                </button>
                <span className={`hidden sm:block text-xs font-medium ${i === step ? 'text-eco-400' : 'text-slate-600'}`}>{s.title}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-eco-500' : 'bg-white/[0.06]'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-eco-500/10 border border-eco-500/20 flex items-center justify-center text-2xl">{steps[step].icon}</div>
                <div>
                  <h2 className="font-semibold text-white">{steps[step].title}</h2>
                  <p className="text-xs text-slate-500">Enter your weekly/monthly usage</p>
                </div>
              </div>

              <div className="space-y-6">
                {step === 0 && (<>
                  <Slider label="Car / Motorbike" icon="🚗" value={inputs.carKm} max={500} unit="km/wk" onChange={v => set('carKm', v)} />
                  <Slider label="Bus / Auto" icon="🚌" value={inputs.busKm} max={300} unit="km/wk" onChange={v => set('busKm', v)} />
                  <Slider label="Train / Metro" icon="🚆" value={inputs.trainKm} max={400} unit="km/wk" onChange={v => set('trainKm', v)} />
                  <Slider label="Flights" icon="✈️" value={inputs.flightHrs} max={200} unit="hrs/yr" onChange={v => set('flightHrs', v)} />
                </>)}
                {step === 1 && (<>
                  <Slider label="Electricity" icon="⚡" value={inputs.electricity} max={1000} unit="kWh/mo" onChange={v => set('electricity', v)} />
                  <Slider label="LPG Cylinders" icon="🔥" value={inputs.lpg} max={10} unit="/mo" onChange={v => set('lpg', v)} />
                </>)}
                {step === 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'vegan', label: '🌱 Vegan', sub: 'Lowest emissions' },
                      { value: 'vegetarian', label: '🥗 Vegetarian', sub: 'Low emissions' },
                      { value: 'eggetarian', label: '🥚 Eggetarian', sub: 'Moderate' },
                      { value: 'omnivore', label: '🍖 Non-Veg', sub: 'Higher emissions' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => set('diet', opt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${inputs.diet === opt.value ? 'border-eco-500/60 bg-eco-500/8' : 'border-white/[0.06] hover:border-white/20'}`}>
                        <p className="text-sm font-semibold text-white">{opt.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.sub}</p>
                      </button>
                    ))}
                  </div>
                )}
                {step === 3 && (<>
                  <Slider label="Plastic waste" icon="🛍️" value={inputs.plastic} max={10} unit="kg/wk" onChange={v => set('plastic', v)} />
                  <Slider label="Paper/cardboard" icon="📦" value={inputs.paper} max={10} unit="kg/wk" onChange={v => set('paper', v)} />
                  <Slider label="Recycling rate" icon="♻️" value={inputs.recycling} max={100} unit="%" onChange={v => set('recycling', v)} />
                </>)}
              </div>

              <div className="flex gap-3 mt-7">
                {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)} icon={<IoArrowBack size={14} />}>Back</Button>}
                {step < steps.length - 1
                  ? <Button className="flex-1" onClick={() => setStep(step + 1)}>Next: {steps[step + 1].title} <IoArrowForward size={14} /></Button>
                  : <Button className="flex-1" onClick={handleCalculate} icon="🧮">Calculate My Footprint</Button>
                }
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
          {/* Hero result */}
          <div className="rounded-3xl p-7 text-white text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #052e16, #0d9488)', boxShadow: '0 0 60px rgba(34,197,94,0.2)' }}>
            <div className="absolute inset-0 bg-noise opacity-30" />
            <div className="relative z-10">
              <p className="text-slate-300 text-sm mb-2">Your Annual Carbon Footprint</p>
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                className="stat-number text-7xl font-black">{results.totalTonnes}</motion.p>
              <p className="text-xl text-eco-200 mt-1">tonnes CO₂/year</p>
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ratingColor[results.rating] }} />
                <span className="text-sm font-semibold">{results.rating} Carbon Footprint</span>
              </div>
              <div className="flex justify-center gap-4 mt-5">
                {[
                  { label: 'vs Global avg', value: results.vsGlobal, better: results.vsGlobal > 0 },
                  { label: 'vs India avg', value: results.vsIndia, better: results.vsIndia > 0 },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
                    <p className={`stat-number text-xl font-bold ${s.better ? 'text-eco-300' : 'text-red-300'}`}>
                      {s.value > 0 ? '+' : ''}{s.value}%
                    </p>
                    <p className="text-xs text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Breakdown chart */}
            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
              <h3 className="font-semibold text-white mb-4">Breakdown</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={results.breakdown} cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3} dataKey="value">
                    {results.breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${v}%`]} contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {results.breakdown.map((cat, i) => (
                  <ProgressBar key={i} label={cat.name} value={cat.value} max={100} color="gradient" size="sm" showValue />
                ))}
              </div>
            </div>

            {/* AI recommendations */}
            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
              <h3 className="font-semibold text-white mb-4">💡 Recommendations</h3>
              <div className="space-y-3">
                {[
                  inputs.carKm > 100 && { icon: '🚌', tip: 'Using public transit 3x/week could cut your transport emissions by 40%.' },
                  inputs.electricity > 200 && { icon: '💡', tip: 'Switch to LED lighting and off-peak usage to save 20% on home energy.' },
                  inputs.diet === 'omnivore' && { icon: '🥗', tip: 'Going vegetarian 3 days/week saves ~200 kg CO₂/year.' },
                  inputs.recycling < 40 && { icon: '♻️', tip: 'Increase recycling to 70%+ to significantly cut waste emissions.' },
                  { icon: '☀️', tip: 'Solar panels have a 4-6 year payback in India with government subsidies available.' },
                ].filter(Boolean).slice(0, 4).map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-eco-500/5 rounded-xl border border-eco-500/10">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={reset}>Recalculate</Button>
            {saved ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-eco-500/10 rounded-xl border border-eco-500/20 text-eco-400 text-sm font-semibold">
                <IoCheckmarkCircle size={16} /> Saved to Firestore
              </div>
            ) : (
              <Button className="flex-1" onClick={handleSave} loading={saving} icon={<IoSave size={14} />}>
                Save to Dashboard
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
