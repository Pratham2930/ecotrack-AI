import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, LineChart as LineChartIcon } from 'lucide-react'
import { Card, EmptyState, Loader, SectionHeader } from '../components/ui/Primitives'
import {
  CategoryBarChart,
  CategoryPieChart,
  EmissionsAreaChart,
  ScoreLineChart,
} from '../components/charts/Charts'
import { useUserData } from '../hooks/useUserData'
import { categoryBreakdown, monthlySeries } from '../utils/series'
import { formatKg } from '../utils/carbon'

export default function Analytics() {
  const { loading, entries, latest } = useUserData()
  const series = useMemo(() => monthlySeries(entries), [entries])
  const pie = useMemo(() => categoryBreakdown(latest), [latest])

  const reductionSeries = useMemo(() => {
    if (series.length === 0) return []
    const baseline = series[0].total || 1
    return series.map((s) => ({
      label: s.label,
      reduction: Math.max(0, Math.round(((baseline - s.total) / baseline) * 100)),
    }))
  }, [series])

  if (loading) return <Loader />

  if (!latest) {
    return (
      <div>
        <SectionHeader icon={LineChartIcon} title="Analytics" description="Visualise your emissions over time." />
        <EmptyState
          icon={Calculator}
          title="No data to analyse yet"
          description="Log a footprint to unlock interactive charts and insights."
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
        icon={LineChartIcon}
        title="Analytics"
        description="Interactive insights into your carbon footprint, categories and sustainability progress."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-lg font-bold">Monthly Emissions Trend</h2>
          {series.length > 1 ? (
            <EmissionsAreaChart data={series} />
          ) : (
            <SingleMonthNote />
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-bold">Category-wise Breakdown</h2>
          <CategoryPieChart data={pie} />
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-bold">Sustainability Score Trend</h2>
          {series.length > 1 ? <ScoreLineChart data={series} /> : <SingleMonthNote />}
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-bold">Carbon Reduction Progress</h2>
          {reductionSeries.length > 1 ? (
            <CategoryBarChart
              data={series.map((s) => ({
                label: s.label,
                transport: s.transport,
                energy: s.energy,
                food: s.food,
                waste: s.waste,
              }))}
            />
          ) : (
            <SingleMonthNote />
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryStat label="Entries logged" value={entries.length} />
          <SummaryStat label="Latest footprint" value={formatKg(latest.total)} />
          <SummaryStat
            label="Best score"
            value={`${entries.reduce((m, e) => Math.max(m, e.score || 0), 0)}/100`}
          />
        </div>
      </Card>
    </div>
  )
}

function SummaryStat({ label, value }) {
  return (
    <div className="rounded-xl bg-eco-600/10 p-4">
      <p className="text-sm text-earth-600 dark:text-earth-300">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-eco-700 dark:text-eco-300">{value}</p>
    </div>
  )
}

function SingleMonthNote() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center text-center text-sm text-earth-500">
      <LineChartIcon className="mb-2 opacity-40" />
      Log footprints across multiple months to reveal this chart.
    </div>
  )
}
