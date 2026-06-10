import { Link } from 'react-router-dom'
import { Calculator, Car, Fuel, Plane, Smartphone, TreePine } from 'lucide-react'
import { Card, EmptyState, Loader, SectionHeader } from '../components/ui/Primitives'
import { useUserData } from '../hooks/useUserData'
import { formatKg } from '../utils/carbon'

export default function Offset() {
  const { loading, latest, totalMonthly, offsets } = useUserData()
  if (loading) return <Loader />

  if (!latest) {
    return (
      <div>
        <SectionHeader icon={TreePine} title="Carbon Offset" />
        <EmptyState
          icon={Calculator}
          title="Nothing to offset yet"
          description="Log a footprint to see how many trees would neutralise your emissions."
          action={
            <Link to="/app/calculator" className="btn-primary">
              <Calculator size={18} /> Open Calculator
            </Link>
          }
        />
      </div>
    )
  }

  const equivalences = [
    { icon: Car, label: 'Car travel', value: `${offsets.carKm.toLocaleString()} km`, desc: 'driven in an average petrol car' },
    { icon: Plane, label: 'Air travel', value: `${offsets.flightKm.toLocaleString()} km`, desc: 'flown in economy class' },
    { icon: Fuel, label: 'Gasoline', value: `${offsets.gasolineLitres.toLocaleString()} L`, desc: 'of petrol burned' },
    { icon: Smartphone, label: 'Smartphone charges', value: offsets.smartphoneCharges.toLocaleString(), desc: 'full phone charges' },
  ]

  return (
    <div>
      <SectionHeader
        icon={TreePine}
        title="Carbon Offset"
        description="Understand the scale of your emissions through trees and real-world equivalences."
      />

      {/* Hero: trees */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-eco-600 to-emerald-800 text-white">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm text-eco-100/90">Your annual footprint</p>
            <p className="text-4xl font-extrabold">{formatKg(offsets.annualKg)} CO₂e</p>
            <p className="mt-1 text-sm text-eco-100/90">
              ({formatKg(totalMonthly)} CO₂e / month × 12)
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl" aria-hidden="true">🌳</div>
            <p className="mt-2 text-3xl font-extrabold">{offsets.treesNeeded}</p>
            <p className="text-sm text-eco-100/90">trees to plant per year</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-eco-50/90">
          A mature tree absorbs roughly 21 kg of CO₂ each year. Planting{' '}
          <strong>{offsets.treesNeeded} trees</strong> would offset your current annual emissions —
          but reducing them at the source is even more powerful.
        </p>
      </Card>

      {/* Equivalences */}
      <h2 className="mb-3 text-lg font-bold">Your monthly footprint is equivalent to…</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {equivalences.map((e) => (
          <Card key={e.label} className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-eco-600/10 text-eco-600 dark:text-eco-400">
              <e.icon size={22} />
            </span>
            <p className="mt-3 text-2xl font-extrabold">{e.value}</p>
            <p className="text-sm font-semibold">{e.label}</p>
            <p className="mt-1 text-xs text-earth-500">{e.desc}</p>
          </Card>
        ))}
      </div>

      {/* Example reference */}
      <Card className="mt-6">
        <h2 className="mb-2 text-lg font-bold">How offsetting scales</h2>
        <p className="text-sm text-earth-600 dark:text-earth-300">
          For reference, <strong>250 kg CO₂</strong> equals about <strong>12 trees</strong> planted
          for a year, or roughly <strong>1,300 km</strong> of car travel. Use the marketplace and
          recommendations to bring your number down before offsetting the rest.
        </p>
        <Link to="/app/marketplace" className="btn-secondary mt-4">
          Explore greener alternatives
        </Link>
      </Card>
    </div>
  )
}
