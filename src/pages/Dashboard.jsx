import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts'
import { IoArrowForward, IoFlame, IoTrophy, IoLeaf } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { subscribeToUserCalculations, subscribeToDayHabits } from '../services/firestoreService'
import { useRealtimeSubscription } from '../hooks/useRealtime'
import { StatCard } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar, CircularProgress } from '../components/ui/ProgressBar'
import { SkeletonCard } from '../components/ui/LoadingSpinner'

const COLORS = ['#22c55e', '#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6']

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl p-3 border border-white/10 text-xs shadow-glass-dark">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-mono">{p.value}</span></p>
      ))}
    </div>
  )
}

const today = new Date().toISOString().split('T')[0]

const HABITS_LIST = [
  { id: 'h1', name: 'Public Transport', points: 15, co2Saved: 2.4 },
  { id: 'h2', name: 'Plant-based Meal', points: 12, co2Saved: 1.2 },
  { id: 'h3', name: 'No Single-use Plastic', points: 10, co2Saved: 0.5 },
  { id: 'h4', name: 'Lights Off', points: 8, co2Saved: 0.3 },
  { id: 'h5', name: 'Walk/Cycle Short Trips', points: 15, co2Saved: 0.8 },
]

export default function Dashboard() {
  const { user, profile } = useAuthStore()
  const [calculations, setCalculations] = useState([])
  const [todayHabits, setTodayHabits] = useState([])

  // Real-time calculations
  useEffect(() => {
    if (!user?.uid) return
    const unsub = subscribeToUserCalculations(user.uid, setCalculations)
    return () => unsub()
  }, [user?.uid])

  // Real-time today's habits
  useEffect(() => {
    if (!user?.uid) return
    const unsub = subscribeToDayHabits(user.uid, today, setTodayHabits)
    return () => unsub()
  }, [user?.uid])

  // Build chart data from real calculations
  const chartData = calculations.slice(0, 6).reverse().map((c, i) => ({
    month: c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString('en', { month: 'short' }) : `Calc ${i + 1}`,
    emissions: c.totalTonnes || 0,
    target: Math.max(0.5, (c.totalTonnes || 0) * 0.85),
  }))

  const breakdown = calculations[0]?.breakdown || [
    { name: 'Transport', value: 35 }, { name: 'Energy', value: 28 },
    { name: 'Food', value: 22 }, { name: 'Waste', value: 15 },
  ]

  const habitsProgress = { completed: todayHabits.length, total: HABITS_LIST.length }
  const loading = !profile

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {profile?.name?.split(' ')[0] || 'Eco Warrior'} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm flex items-center gap-2">
            <span className="live-dot" />
            Live dashboard · synced from Firestore
          </p>
        </div>
        <Link to="/calculator">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn-neon text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5">
            + New Calculation <IoArrowForward size={14} />
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatCard title="Carbon Score" value={`${(profile?.carbonScore || 0).toFixed(1)}t`} subtitle="CO₂/year" icon="🌱" color="eco" trend={-12} trendLabel=" YoY" delay={0} />
            <StatCard title="Eco Points" value={(profile?.ecoPoints || 0).toLocaleString()} subtitle="All time" icon="⭐" color="orange" trend={8} delay={0.08} />
            <StatCard title="Day Streak" value={`${profile?.currentStreak || 0}`} subtitle="Keep it up!" icon="🔥" color="purple" delay={0.16} />
            <StatCard title="Global Rank" value={`#${(profile?.globalRank || 999999).toLocaleString()}`} subtitle="Worldwide" icon="🏆" color="teal" trend={5} delay={0.24} />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Emissions trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-white">Emissions History</h2>
              <p className="text-xs text-slate-500 mt-0.5">From your Firestore calculations</p>
            </div>
            <Badge color="green" pulse>{calculations.length} records</Badge>
          </div>
          {chartData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-600">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">No calculations yet</p>
              <Link to="/calculator" className="text-xs text-eco-400 mt-1 hover:underline">Run your first calculation →</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ecoGrd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<GlassTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Area type="monotone" dataKey="target" name="Target" stroke="#14b8a6" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
                <Area type="monotone" dataKey="emissions" name="Emissions (t)" stroke="#22c55e" fill="url(#ecoGrd)" strokeWidth={2} dot={{ fill: '#22c55e', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
          <h2 className="font-semibold text-white mb-1">Emission Breakdown</h2>
          <p className="text-xs text-slate-500 mb-4">Latest calculation</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={breakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {breakdown.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-400">{cat.name}</span>
                </div>
                <span className="stat-number font-medium text-slate-300">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sustainability score + Habits */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Score card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5 flex flex-col items-center">
          <h2 className="font-semibold text-white self-start mb-4">Sustainability Score</h2>
          <CircularProgress
            value={profile?.sustainabilityScore || 0}
            max={100} size={160} strokeWidth={10}
            color="#22c55e" glowColor="rgba(34,197,94,0.4)"
          >
            <div className="text-center">
              <span className="stat-number text-4xl font-semibold text-white">{profile?.sustainabilityScore || 0}</span>
              <p className="text-xs text-slate-500 mt-0.5">/ 100</p>
            </div>
          </CircularProgress>
          <Badge color="green" className="mt-4 text-sm px-3 py-1">{profile?.ecoLevelName || 'Beginner'}</Badge>
          <p className="text-xs text-slate-600 mt-2">Updates with each new calculation</p>

          <div className="w-full mt-4 space-y-2.5">
            {(calculations[0]?.breakdown || []).slice(0, 3).map((item, i) => (
              <ProgressBar key={i} label={item.name} value={item.value} max={50} color="gradient"
                size="sm" showValue glowColor="rgba(34,197,94,0.3)" />
            ))}
          </div>
        </motion.div>

        {/* Today's habits */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white">Today's Habits</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time from Firestore</p>
            </div>
            <Link to="/streak">
              <Badge color="green">{habitsProgress.completed}/{habitsProgress.total} done</Badge>
            </Link>
          </div>
          <ProgressBar value={habitsProgress.completed} max={habitsProgress.total} color="gradient" size="md"
            glowColor="rgba(34,197,94,0.4)" className="mb-4" />
          <div className="space-y-2">
            {HABITS_LIST.map(h => {
              const done = todayHabits.includes(h.id)
              return (
                <div key={h.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${done ? 'bg-eco-500/8 border border-eco-500/15' : 'bg-white/[0.02] border border-white/[0.04]'}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm shrink-0 ${done ? 'bg-eco-500 text-white' : 'bg-white/5 text-slate-600'}`}>
                    {done ? '✓' : '○'}
                  </div>
                  <span className={`text-sm flex-1 ${done ? 'text-eco-400 line-through' : 'text-slate-300'}`}>{h.name}</span>
                  <span className={`text-xs stat-number ${done ? 'text-eco-500' : 'text-slate-600'}`}>+{h.points}pts</span>
                </div>
              )
            })}
          </div>
          <Link to="/streak" className="mt-3 flex items-center justify-center gap-1 text-xs text-eco-400 hover:text-eco-300 transition-colors">
            Go to Green Streak <IoArrowForward size={12} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
