import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Bus,
  Calculator,
  Car,
  Bike,
  Drumstick,
  Leaf,
  Plane,
  Recycle,
  Save,
  Train,
  Trash2,
  Zap,
} from 'lucide-react'
import { Card, SectionHeader, ScoreRing } from '../components/ui/Primitives'
import { FormField } from '../components/ui/FormField'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import {
  DIET_LABELS,
  calculateFootprint,
  formatKg,
  sustainabilityScore,
} from '../utils/carbon'
import { saveEntry } from '../services/dataService'
import { cn } from '../utils/cn'

const DEFAULTS = {
  transport: { car: 0, bike: 0, bus: 0, train: 0, flight: 0 },
  energy: { electricity: 0, lpg: 0 },
  diet: 'vegetarian',
  waste: { plastic: 0, paper: 0, recyclingRate: 50 },
}

const DIETS = [
  { key: 'vegan', icon: '🌱' },
  { key: 'vegetarian', icon: '🥗' },
  { key: 'eggetarian', icon: '🥚' },
  { key: 'nonveg', icon: '🍗' },
]

export default function CalculatorPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, setValue } = useForm({ defaultValues: DEFAULTS })
  const values = watch()

  const footprint = useMemo(() => calculateFootprint(values), [values])
  const score = useMemo(() => sustainabilityScore(footprint.total), [footprint.total])

  const onSubmit = async (data) => {
    setSubmitting(true)
    const fp = calculateFootprint(data)
    try {
      await saveEntry(user.uid, {
        total: fp.total,
        transport: fp.transport,
        energy: fp.energy,
        food: fp.food,
        waste: fp.waste,
        score: sustainabilityScore(fp.total),
        inputs: data,
      })
      setSaved(true)
    } finally {
      setSubmitting(false)
    }
  }

  const num = (path) =>
    register(path, { valueAsNumber: true, min: { value: 0, message: 'No negatives' } })

  return (
    <div>
      <SectionHeader
        icon={Calculator}
        title="Carbon Footprint Calculator"
        description="Enter your typical monthly activity. We estimate CO₂ emissions using realistic factors and update your footprint live."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Transport */}
          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Car size={18} className="text-eco-600 dark:text-eco-400" /> Transportation
              <span className="ml-auto text-sm font-semibold text-earth-500">
                {formatKg(footprint.transport)}
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="car" label="Car travel" type="number" step="any" min="0" suffix="km" {...num('transport.car')} />
              <FormField id="bike" label="Bike (motorbike)" type="number" step="any" min="0" suffix="km" {...num('transport.bike')} />
              <FormField id="bus" label="Bus travel" type="number" step="any" min="0" suffix="km" {...num('transport.bus')} />
              <FormField id="train" label="Train travel" type="number" step="any" min="0" suffix="km" {...num('transport.train')} />
              <FormField id="flight" label="Flight travel" type="number" step="any" min="0" suffix="km" {...num('transport.flight')} />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-earth-500 dark:text-earth-400">
              <span className="flex items-center gap-1"><Bike size={13} /> two-wheeler</span>
              <span className="flex items-center gap-1"><Bus size={13} /> public</span>
              <span className="flex items-center gap-1"><Train size={13} /> rail</span>
              <span className="flex items-center gap-1"><Plane size={13} /> air</span>
            </div>
          </Card>

          {/* Energy */}
          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Zap size={18} className="text-amber-500" /> Home Energy
              <span className="ml-auto text-sm font-semibold text-earth-500">
                {formatKg(footprint.energy)}
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="electricity" label="Electricity consumption" type="number" step="any" min="0" suffix="kWh" {...num('energy.electricity')} />
              <FormField id="lpg" label="LPG usage" type="number" step="any" min="0" suffix="kg" {...num('energy.lpg')} />
            </div>
          </Card>

          {/* Food */}
          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Drumstick size={18} className="text-rose-500" /> Food Habits
              <span className="ml-auto text-sm font-semibold text-earth-500">
                {formatKg(footprint.food)}
              </span>
            </h2>
            <fieldset>
              <legend className="sr-only">Select your diet</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {DIETS.map((d) => {
                  const active = values.diet === d.key
                  return (
                    <button
                      type="button"
                      key={d.key}
                      onClick={() => setValue('diet', d.key)}
                      aria-pressed={active}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-semibold transition-all',
                        active
                          ? 'border-eco-600 bg-eco-600/10 text-eco-700 dark:text-eco-300'
                          : 'border-earth-200 text-earth-600 hover:border-eco-400 dark:border-white/10 dark:text-earth-300',
                      )}
                    >
                      <span className="text-2xl" aria-hidden="true">{d.icon}</span>
                      {DIET_LABELS[d.key]}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </Card>

          {/* Waste */}
          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Trash2 size={18} className="text-sky-500" /> Waste Management
              <span className="ml-auto text-sm font-semibold text-earth-500">
                {formatKg(footprint.waste)}
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="plastic" label="Plastic waste" type="number" step="any" min="0" suffix="kg" {...num('waste.plastic')} />
              <FormField id="paper" label="Paper waste" type="number" step="any" min="0" suffix="kg" {...num('waste.paper')} />
            </div>
            <div className="mt-4">
              <label htmlFor="recyclingRate" className="label flex items-center gap-2">
                <Recycle size={15} /> Recycling rate
                <span className="ml-auto text-eco-600 dark:text-eco-400">
                  {values.waste?.recyclingRate ?? 0}%
                </span>
              </label>
              <input
                id="recyclingRate"
                type="range"
                min="0"
                max="100"
                step="5"
                className="w-full accent-eco-600"
                aria-valuetext={`${values.waste?.recyclingRate ?? 0} percent`}
                {...register('waste.recyclingRate', { valueAsNumber: true })}
              />
            </div>
          </Card>
        </div>

        {/* Live summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-earth-600 dark:text-earth-300">
              Estimated Monthly Footprint
            </h2>
            <p className="mt-2 text-center text-4xl font-extrabold text-eco-600 dark:text-eco-400">
              {formatKg(footprint.total)}
              <span className="text-base font-semibold text-earth-500"> CO₂e</span>
            </p>

            <div className="mt-5 flex justify-center">
              <ScoreRing score={score} label="Eco Score" />
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              {footprint.breakdown.map((b) => (
                <li key={b.key} className="flex items-center justify-between">
                  <span className="text-earth-600 dark:text-earth-300">{b.label}</span>
                  <span className="font-semibold">{formatKg(b.value)}</span>
                </li>
              ))}
            </ul>

            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
              <Save size={18} /> {submitting ? 'Saving…' : 'Save this footprint'}
            </button>
            <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-earth-500">
              <Leaf size={12} /> Earns +50 eco points
            </p>
          </Card>
        </div>
      </form>

      <Modal open={saved} onClose={() => navigate('/app')} title="Footprint saved! 🎉">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 animate-pop-in place-items-center rounded-full bg-eco-600/15 text-3xl">
            🌿
          </div>
          <p className="mt-4 text-earth-700 dark:text-earth-200">
            Your footprint of <strong>{formatKg(footprint.total)} CO₂e</strong> was recorded and you
            earned <strong>+50 eco points</strong>.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setSaved(false)} className="btn-secondary flex-1">
              Log another
            </button>
            <button onClick={() => navigate('/app')} className="btn-primary flex-1">
              View dashboard
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
