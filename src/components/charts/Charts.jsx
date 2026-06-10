import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axisProps = {
  tick: { fontSize: 12, fill: 'currentColor' },
  className: 'text-earth-500 dark:text-earth-400',
  tickLine: false,
  axisLine: false,
}

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: '1px solid rgba(16,185,129,0.25)',
      background: 'rgba(255,255,255,0.96)',
      color: '#0f172a',
      fontSize: 13,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    },
  }
}

/** Monthly emissions trend (area). */
export function EmissionsAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="emArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-earth-200/60 dark:stroke-white/5" vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle()} formatter={(v) => [`${v} kg`, 'CO₂e']} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#emArea)"
          name="CO₂e"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** Category-wise breakdown (pie/donut). */
export function CategoryPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle()} formatter={(v, n) => [`${v} kg`, n]} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span className="text-earth-600 dark:text-earth-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

/** Sustainability score trend (line). */
export function ScoreLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-earth-200/60 dark:stroke-white/5" vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip {...tooltipStyle()} formatter={(v) => [`${v}/100`, 'Score']} />
        <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} name="Score" />
      </LineChart>
    </ResponsiveContainer>
  )
}

/** Stacked category bars per month. */
export function CategoryBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-earth-200/60 dark:stroke-white/5" vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle()} formatter={(v, n) => [`${v} kg`, n]} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
        <Bar dataKey="transport" stackId="a" fill="#10b981" name="Transport" radius={[0, 0, 0, 0]} />
        <Bar dataKey="energy" stackId="a" fill="#f59e0b" name="Energy" />
        <Bar dataKey="food" stackId="a" fill="#f43f5e" name="Food" />
        <Bar dataKey="waste" stackId="a" fill="#0ea5e9" name="Waste" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Generic comparison bar (used in benchmarking). */
export function ComparisonBarChart({ data, dataKey = 'value', color = '#10b981', unit = 'kg' }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-earth-200/60 dark:stroke-white/5" horizontal={false} />
        <XAxis type="number" {...axisProps} />
        <YAxis type="category" dataKey="name" width={96} {...axisProps} />
        <Tooltip {...tooltipStyle()} formatter={(v) => [`${v} ${unit}`, '']} />
        <Bar dataKey={dataKey} radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.highlight ? '#059669' : d.color || color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
