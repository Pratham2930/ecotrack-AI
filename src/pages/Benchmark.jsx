import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { IoEarth } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { subscribeToGlobalLeaderboard, subscribeToCountryLeaderboard, subscribeToCountryStats, getUserGlobalRank } from '../services/firestoreService'
import { Badge } from '../components/ui/Badge'
import { CircularProgress } from '../components/ui/ProgressBar'
import { SkeletonCard } from '../components/ui/LoadingSpinner'

const STATIC_COUNTRIES = [
  { country: 'Qatar', emissions: 31.4, color: '#ef4444' },
  { country: 'Australia', emissions: 15.2, color: '#f97316' },
  { country: 'USA', emissions: 14.5, color: '#f97316' },
  { country: 'Canada', emissions: 13.6, color: '#eab308' },
  { country: 'Russia', emissions: 11.4, color: '#eab308' },
  { country: 'Japan', emissions: 9.0, color: '#84cc16' },
  { country: 'China', emissions: 8.1, color: '#84cc16' },
  { country: 'Germany', emissions: 7.9, color: '#84cc16' },
  { country: 'UK', emissions: 5.6, color: '#22c55e' },
  { country: 'India', emissions: 1.9, color: '#16a34a' },
]

export default function Benchmark() {
  const [tab, setTab] = useState('global')
  const [globalBoard, setGlobalBoard] = useState([])
  const [countryBoard, setCountryBoard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuthStore()
  const userCO2 = profile?.carbonScore || 3.8

  useEffect(() => {
    const u1 = subscribeToGlobalLeaderboard((data) => { setGlobalBoard(data); setLoading(false) })
    return () => u1()
  }, [])

  useEffect(() => {
    if (!profile?.country) return
    const u2 = subscribeToCountryLeaderboard(profile.country, setCountryBoard)
    return () => u2()
  }, [profile?.country])

  useEffect(() => {
    if (!user?.uid) return
    getUserGlobalRank(user?.uid).then(setUserRank)
  }, [user?.uid])

  const insights = [
    { text: `You emit ${Math.abs(((userCO2 - 1.9) / 1.9 * 100)).toFixed(0)}% ${userCO2 < 1.9 ? 'less' : 'more'} than the average person in India.`, type: userCO2 < 1.9 ? 'positive' : 'warning', icon: '🇮🇳' },
    { text: `You emit ${Math.abs(((userCO2 - 4.7) / 4.7 * 100)).toFixed(0)}% ${userCO2 < 4.7 ? 'less' : 'more'} than the global average of 4.7 t/yr.`, type: userCO2 < 4.7 ? 'positive' : 'warning', icon: '🌍' },
    { text: userRank ? `Your global rank is #${userRank.toLocaleString()} based on live Firestore data.` : 'Complete more calculations to improve your global ranking.', type: 'neutral', icon: '🏆' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoEarth className="text-eco-400" /> Global Carbon Benchmarking
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <span className="live-dot" /> Live rankings from Firestore · updates as users submit calculations
        </p>
      </motion.div>

      {/* User banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #052e16, #134e4a)', border: '1px solid rgba(34,197,94,0.15)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold">Your footprint: {userCO2} t CO₂/year</p>
            <p className="text-eco-200 text-sm mt-1">
              {insights[0].text} {insights[1].text}
            </p>
          </div>
          <div className="flex gap-3">
            {[{ v: userCO2 + 't', l: 'You' }, { v: '1.9t', l: 'India avg' }, { v: '4.7t', l: 'World avg' }].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                <p className="stat-number text-lg font-bold">{s.v}</p>
                <p className="text-xs text-eco-200/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl w-fit">
        {[['global', '🌍 Global Board'], ['country', '🇮🇳 Country Board'], ['compare', '📊 Country Compare']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-eco-500/15 text-eco-400 border border-eco-500/25' : 'text-slate-500 hover:text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'global' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Global Leaderboard</h2>
            <Badge color="green" pulse>Live · {globalBoard.length} users</Badge>
          </div>
          {loading ? (
            <div className="space-y-3">{Array(5).fill(0).map((_, i) => <SkeletonCard key={i} className="h-14" />)}</div>
          ) : globalBoard.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-sm">Be the first! Save a calculation to appear on the leaderboard.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {globalBoard.map((entry, i) => (
                <motion.div key={entry.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${entry.id === user?.uid ? 'bg-eco-500/8 border border-eco-500/15' : 'bg-white/[0.02] border border-white/[0.04]'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    entry.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                    entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-slate-500'
                  }`}>
                    {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
                  </div>
                  <img src={entry.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.id}`}
                    alt={entry.name} className="w-8 h-8 rounded-lg border border-white/10 object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${entry.id === user?.uid ? 'text-eco-400' : 'text-slate-200'}`}>
                      {entry.name} {entry.id === user?.uid && <span className="text-xs text-eco-500">(You)</span>}
                    </p>
                    <p className="text-xs text-slate-600">{entry.country}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="stat-number text-sm font-semibold text-white">{(entry.ecoPoints || 0).toLocaleString()} pts</p>
                    <p className="text-xs text-eco-500">{(entry.carbonScore || 0).toFixed(1)}t CO₂</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'country' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">{profile?.country || 'India'} Leaderboard</h2>
            <Badge color="green" pulse>Live · {countryBoard.length} users</Badge>
          </div>
          {countryBoard.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              <div className="text-4xl mb-2">🇮🇳</div>
              <p className="text-sm">No users in {profile?.country || 'India'} yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {countryBoard.map((entry, i) => (
                <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-xl ${entry.id === user?.uid ? 'bg-eco-500/8 border border-eco-500/15' : 'bg-white/[0.02] border border-white/[0.04]'}`}>
                  <span className="text-sm font-bold text-slate-500 w-5">#{entry.rank}</span>
                  <img src={entry.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.id}`}
                    className="w-8 h-8 rounded-lg border border-white/10" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${entry.id === user?.uid ? 'text-eco-400' : 'text-slate-200'}`}>{entry.name}</p>
                    <p className="text-xs text-slate-600">{entry.city}</p>
                  </div>
                  <p className="stat-number text-sm font-semibold text-white">{(entry.ecoPoints || 0).toLocaleString()} pts</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'compare' && (
        <div className="space-y-5">
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
            <h2 className="font-semibold text-white mb-1">Countries by Per-Capita Emissions</h2>
            <p className="text-xs text-slate-500 mb-5">Static reference data · dashed line = your footprint</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={STATIC_COUNTRIES} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="country" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={v => [`${v} t CO₂`, 'Emissions']} contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <ReferenceLine x={userCO2} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={2}
                  label={{ value: 'You', fill: '#22c55e', fontSize: 10 }} />
                <Bar dataKey="emissions" radius={[0, 4, 4, 0]}>
                  {STATIC_COUNTRIES.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Global', pct: 72, desc: 'Better than 72% of users' },
              { label: profile?.country || 'India', pct: 85, desc: `Better than 85% in ${profile?.country || 'India'}` },
              { label: profile?.city || 'Mumbai', pct: 78, desc: `Better than 78% in ${profile?.city || 'your city'}` },
              { label: 'Your Age Group', pct: 81, desc: 'Better than 81% in age group' },
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5 text-center">
                <CircularProgress value={p.pct} max={100} size={100} strokeWidth={8} color="#22c55e" glowColor="rgba(34,197,94,0.3)">
                  <span className="stat-number text-xl font-semibold text-white">{p.pct}%</span>
                </CircularProgress>
                <h3 className="font-semibold text-white mt-3 text-sm">{p.label}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                ins.type === 'positive' ? 'bg-eco-500/5 border-eco-500/15' :
                ins.type === 'warning' ? 'bg-orange-500/5 border-orange-500/15' :
                'bg-blue-500/5 border-blue-500/15'
              }`}>
                <span className="text-xl shrink-0">{ins.icon}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
