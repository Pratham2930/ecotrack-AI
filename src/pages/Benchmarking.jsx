import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, Globe2, MapPin, TrendingDown } from 'lucide-react'
import { Card, EmptyState, Loader, ScoreRing, SectionHeader, StatCard } from '../components/ui/Primitives'
import { ComparisonBarChart } from '../components/charts/Charts'
import { useUserData } from '../hooks/useUserData'
import {
  benchmarkInsights,
  comparisonChartData,
  globalPercentile,
} from '../utils/benchmark'
import { COUNTRIES, GLOBAL_AVG } from '../data/countries'
import { formatKg } from '../utils/carbon'

export default function Benchmarking() {
  const { loading, latest, totalMonthly, profile, score } = useUserData()

  const insights = useMemo(
    () => benchmarkInsights(totalMonthly, profile),
    [totalMonthly, profile],
  )
  const chartData = useMemo(
    () => comparisonChartData(totalMonthly, profile),
    [totalMonthly, profile],
  )
  const percentile = useMemo(() => globalPercentile(totalMonthly), [totalMonthly])

  const rankedCountries = useMemo(
    () => [...COUNTRIES].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore).slice(0, 8),
    [],
  )

  if (loading) return <Loader />

  if (!latest) {
    return (
      <div>
        <SectionHeader icon={Globe2} title="Global Benchmarking" />
        <EmptyState
          icon={Calculator}
          title="No footprint to compare"
          description="Log a footprint to benchmark yourself against your city, country and the world."
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
        icon={Globe2}
        title="Global Carbon Benchmarking"
        description="See how your footprint compares to users in your city, country and worldwide."
        action={
          !profile.country ? (
            <Link to="/app/profile" className="btn-secondary">
              <MapPin size={16} /> Set your location
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingDown} label="Your Footprint" value={formatKg(totalMonthly)} sub="per month" />
        <StatCard icon={Globe2} label="Global Average" value={formatKg(GLOBAL_AVG.monthlyAvgKg)} sub="per month" tone="sky" />
        <StatCard icon={TrendingDown} label="Global Ranking" value={`Top ${percentile.topPercent}%`} sub="most sustainable" tone="violet" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">How you compare</h2>
          <ComparisonBarChart data={chartData} />
        </Card>

        <Card className="flex flex-col items-center text-center">
          <h2 className="mb-2 self-start text-lg font-bold">Your Sustainability Score</h2>
          <ScoreRing score={score} size={150} />
          <p className="mt-3 text-sm text-earth-600 dark:text-earth-300">
            Global average score: <strong>{GLOBAL_AVG.sustainabilityScore}/100</strong>
          </p>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Insights</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {insights.map((text, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-xl bg-eco-600/10 p-3 text-sm font-medium text-eco-800 dark:text-eco-200"
            >
              <Globe2 size={16} className="mt-0.5 shrink-0" /> {text}
            </li>
          ))}
        </ul>
      </Card>

      {/* Country leaderboard */}
      <Card className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Most Sustainable Countries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-earth-500">
                <th className="pb-2">#</th>
                <th className="pb-2">Country</th>
                <th className="pb-2 text-right">Avg footprint</th>
                <th className="pb-2 text-right">Renewables</th>
                <th className="pb-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {rankedCountries.map((c, i) => (
                <tr key={c.code} className="border-t border-earth-200/60 dark:border-white/10">
                  <td className="py-2 font-semibold text-earth-500">{i + 1}</td>
                  <td className="py-2 font-medium">
                    <span aria-hidden="true">{c.flag}</span> {c.name}
                  </td>
                  <td className="py-2 text-right">{formatKg(c.monthlyAvgKg)}</td>
                  <td className="py-2 text-right">{c.renewablePct}%</td>
                  <td className="py-2 text-right font-bold text-eco-600 dark:text-eco-400">
                    {c.sustainabilityScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
