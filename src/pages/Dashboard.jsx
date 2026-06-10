import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  Cloud,
  Flame,
  Leaf,
  Lightbulb,
  Sparkles,
  TreePine,
  TrendingUp,
} from 'lucide-react'
import { Card, EmptyState, Loader, ProgressBar, ScoreRing, StatCard } from '../components/ui/Primitives'
import { EmissionsAreaChart, CategoryPieChart } from '../components/charts/Charts'
import { useUserData } from '../hooks/useUserData'
import { formatKg } from '../utils/carbon'
import { generateRecommendations } from '../utils/recommendations'
import { categoryBreakdown, monthlySeries, trendChange } from '../utils/series'
import { scoreRating } from '../utils/carbon'

export default function Dashboard() {
  const {
    loading,
    entries,
    latest,
    totalMonthly,
    score,
    offsets,
    streak,
    level,
    points,
  } = useUserData()

  const series = useMemo(() => monthlySeries(entries), [entries])
  const pie = useMemo(() => categoryBreakdown(latest), [latest])
  const change = useMemo(() => trendChange(entries), [entries])
  const recs = useMemo(
    () => (latest ? generateRecommendations(latest, latest.inputs) : []),
    [latest],
  )

  if (loading) return <Loader label="Loading your dashboard…" />

  if (!latest) {
    return (
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Welcome to EcoTrack AI 🌱</h1>
        <p className="mt-1 text-earth-600 dark:text-earth-300">
          Let’s measure your first carbon footprint to unlock your dashboard.
        </p>
        <div className="mt-8">
          <EmptyState
            icon={Calculator}
            title="No footprint logged yet"
            description="Use the calculator to estimate your monthly CO₂ emissions and start tracking your impact."
            action={
              <Link to="/app/calculator" className="btn-primary">
                <Calculator size={18} /> Open Calculator
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const rating = scoreRating(score)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-earth-600 dark:text-earth-300">
            Your sustainability snapshot at a glance.
          </p>
        </div>
        <Link to="/app/calculator" className="btn-primary">
          <Calculator size={18} /> Log new footprint
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Cloud}
          label="Monthly Footprint"
          value={formatKg(totalMonthly)}
          sub={
            change == null ? (
              'CO₂e this month'
            ) : (
              <span className={change <= 0 ? 'text-eco-600' : 'text-red-500'}>
                <span className="inline-flex items-center gap-0.5">
                  {change <= 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                  {Math.abs(change)}% vs last entry
                </span>
              </span>
            )
          }
        />
        <StatCard icon={Leaf} label="Sustainability Score" value={`${score}/100`} sub={rating.label} tone="eco" />
        <StatCard icon={Sparkles} label="Eco Points" value={points} sub={level.current.name} tone="violet" />
        <StatCard icon={Flame} label="Green Streak" value={`${streak.currentStreak} days`} sub={`Best: ${streak.longestStreak} days`} tone="amber" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">Monthly Emissions Trend</h2>
            <Link to="/app/analytics" className="text-sm font-semibold text-eco-600 hover:underline dark:text-eco-400">
              View analytics
            </Link>
          </div>
          {series.length > 1 ? (
            <EmissionsAreaChart data={series} />
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center text-center text-sm text-earth-500">
              <TrendingUp className="mb-2 opacity-40" />
              Log footprints across multiple months to see your trend.
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-bold">Category Breakdown</h2>
          <CategoryPieChart data={pie} />
        </Card>
      </div>

      {/* Lower row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score + offset */}
        <Card className="flex flex-col items-center text-center">
          <h2 className="mb-3 self-start text-lg font-bold">Sustainability Score</h2>
          <ScoreRing score={score} size={150} />
          <p className="mt-3 text-sm text-earth-600 dark:text-earth-300">
            You’re rated <strong>{rating.label}</strong>. Keep logging to improve.
          </p>
          <div className="mt-4 w-full rounded-xl bg-eco-600/10 p-3">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-eco-700 dark:text-eco-300">
              <TreePine size={16} /> {offsets.treesNeeded} trees / year to offset
            </p>
          </div>
        </Card>

        {/* Recent activities */}
        <Card>
          <h2 className="mb-3 text-lg font-bold">Recent Activities</h2>
          <ul className="space-y-3">
            {entries
              .slice(-5)
              .reverse()
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/40 p-3 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-eco-600/10 text-eco-600 dark:text-eco-400">
                      <Cloud size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{formatKg(e.total)} CO₂e</p>
                      <p className="text-xs text-earth-500">
                        {new Date(e.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-eco-600 dark:text-eco-400">{e.score ?? '–'}</span>
                </li>
              ))}
          </ul>
        </Card>

        {/* Top recommendations */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Top Recommendations</h2>
            <Link to="/app/recommendations" className="text-sm font-semibold text-eco-600 hover:underline dark:text-eco-400">
              See all
            </Link>
          </div>
          <ul className="space-y-3">
            {recs.slice(0, 3).map((r) => (
              <li key={r.id} className="flex items-start gap-3 rounded-xl bg-white/40 p-3 dark:bg-white/5">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-600">
                  <Lightbulb size={15} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  {r.savingKg > 0 ? (
                    <p className="text-xs text-eco-600 dark:text-eco-400">
                      Save ~{formatKg(r.savingKg)} CO₂e/mo
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Level progress strip */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{level.current.icon}</span>
            <div>
              <p className="font-bold">{level.current.name}</p>
              <p className="text-sm text-earth-600 dark:text-earth-300">
                {level.next ? `Next: ${level.next.name}` : 'Maximum level reached!'}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-72">
            <ProgressBar value={level.progress} label="Level progress" />
          </div>
        </div>
      </Card>
    </div>
  )
}
