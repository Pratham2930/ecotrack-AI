import { useMemo, useState } from 'react'
import { ArrowRight, ShoppingBag, Sparkles, Star } from 'lucide-react'
import { Card, Pill, SectionHeader } from '../components/ui/Primitives'
import { useUserData } from '../hooks/useUserData'
import { PRODUCTS, PRODUCT_CATEGORIES, recommendProducts } from '../data/marketplace'
import { cn } from '../utils/cn'

const IMPACT_TONE = { high: 'eco', medium: 'amber', low: 'slate' }

export default function Marketplace() {
  const { latest } = useUserData()
  const [category, setCategory] = useState('All')

  const recommended = useMemo(() => recommendProducts(latest).slice(0, 3), [latest])
  const filtered = useMemo(
    () => (category === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  )

  return (
    <div>
      <SectionHeader
        icon={ShoppingBag}
        title="Eco Impact Marketplace"
        description="Discover greener alternatives with real, estimated annual CO₂ savings."
      />

      {/* Personalized */}
      {latest ? (
        <Card className="mb-6 bg-gradient-to-br from-eco-600 to-emerald-800 text-white">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Sparkles size={18} /> Recommended for you
          </h2>
          <p className="mt-1 text-sm text-eco-100/90">
            Based on your footprint, these swaps offer the biggest impact.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {recommended.map((p) => (
              <div key={p.id} className="rounded-xl bg-white/10 p-3 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">{p.emoji}</span>
                  <p className="text-sm font-semibold">{p.name}</p>
                </div>
                <p className="mt-2 text-xs text-eco-50/90">
                  Saves ~{p.annualCo2SavingKg} kg CO₂/yr
                </p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {/* Category filter */}
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Product categories">
        {PRODUCT_CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
              category === c
                ? 'bg-eco-600 text-white shadow-md shadow-eco-600/25'
                : 'glass text-earth-700 hover:bg-eco-100/60 dark:text-earth-200',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-eco-600/10 text-3xl">
                {p.emoji}
              </span>
              <Pill tone={IMPACT_TONE[p.impact]}>{p.impact} impact</Pill>
            </div>
            <h3 className="mt-3 font-bold">{p.name}</h3>
            <p className="text-xs text-earth-500">Replaces: {p.replaces}</p>

            <div className="mt-3 flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(p.rating) ? 'fill-amber-400' : 'fill-none text-earth-300'}
                />
              ))}
              <span className="ml-1 text-xs text-earth-500">
                {p.rating} ({p.reviews})
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-eco-600/10 p-2 text-center">
                <p className="text-lg font-extrabold text-eco-700 dark:text-eco-300">
                  {p.annualCo2SavingKg}
                </p>
                <p className="text-[11px] text-earth-500">kg CO₂/yr saved</p>
              </div>
              <div className="rounded-lg bg-white/50 p-2 text-center dark:bg-white/5">
                <p className="text-lg font-extrabold">{p.sustainabilityScore}</p>
                <p className="text-[11px] text-earth-500">eco score</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-bold">{p.price}</span>
              <button className="btn-secondary h-9 gap-1 px-3 text-sm">
                View <ArrowRight size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
