import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bus, Calculator, Lightbulb, Recycle, Salad, Zap } from 'lucide-react'
import { Card, EmptyState, Loader, Pill, SectionHeader } from '../components/ui/Primitives'
import { useUserData } from '../hooks/useUserData'
import { generateRecommendations } from '../utils/recommendations'
import { formatKg } from '../utils/carbon'

const CATEGORY_META = {
  transport: { icon: Bus, tone: 'eco', label: 'Transport' },
  energy: { icon: Zap, tone: 'amber', label: 'Energy' },
  food: { icon: Salad, tone: 'red', label: 'Food' },
  waste: { icon: Recycle, tone: 'sky', label: 'Waste' },
  general: { icon: Lightbulb, tone: 'slate', label: 'General' },
}

const IMPACT_TONE = { high: 'eco', medium: 'amber', low: 'slate' }

export default function Recommendations() {
  const { loading, latest } = useUserData()
  const recs = useMemo(
    () => (latest ? generateRecommendations(latest, latest.inputs) : []),
    [latest],
  )
  const totalSaving = useMemo(() => recs.reduce((s, r) => s + (r.savingKg || 0), 0), [recs])

  if (loading) return <Loader />

  if (!latest) {
    return (
      <div>
        <SectionHeader icon={Lightbulb} title="Personalized Recommendations" />
        <EmptyState
          icon={Calculator}
          title="No recommendations yet"
          description="Log a footprint and we’ll generate tailored actions to cut your emissions."
          action={
            <Link to="/app/calculator" className="btn-primary">
              <Calculator size={18} /> Open Calculator
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div>
      <SectionHeader
        icon={Lightbulb}
        title="Personalized Recommendations"
        description="Smart, data-driven actions ranked by their potential impact on your footprint."
      />

      <Card className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-br from-eco-600 to-emerald-800 text-white">
        <div>
          <p className="text-sm text-eco-100/90">Total potential monthly savings</p>
          <p className="text-3xl font-extrabold">{formatKg(totalSaving)} CO₂e</p>
        </div>
        <p className="max-w-sm text-sm text-eco-50/90">
          Acting on all recommendations could cut roughly{' '}
          {latest.total ? Math.round((totalSaving / latest.total) * 100) : 0}% of your current footprint.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {recs.map((r) => {
          const meta = CATEGORY_META[r.category] || CATEGORY_META.general
          const Icon = meta.icon
          return (
            <Card key={r.id} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-eco-600/10 text-eco-600 dark:text-eco-400">
                <Icon size={20} />
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold">{r.title}</h3>
                  <Pill tone={IMPACT_TONE[r.impact]}>{r.impact} impact</Pill>
                </div>
                <p className="mt-1 text-sm text-earth-600 dark:text-earth-300">{r.detail}</p>
                {r.savingKg > 0 ? (
                  <p className="mt-2 text-sm font-semibold text-eco-600 dark:text-eco-400">
                    Save ~{formatKg(r.savingKg)} CO₂e / month
                  </p>
                ) : null}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
