import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IoTrophy, IoPeople, IoTime, IoCheckmarkCircle } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { subscribeToChallenges, subscribeToGlobalLeaderboard, subscribeToCountryLeaderboard, joinChallenge, subscribeToChallengePlayers } from '../services/firestoreService'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Challenges() {
  const [tab, setTab] = useState('challenges')
  const [challenges, setChallenges] = useState([])
  const [globalBoard, setGlobalBoard] = useState([])
  const [countryBoard, setCountryBoard] = useState([])
  const [joining, setJoining] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuthStore()

  useEffect(() => {
    const u1 = subscribeToChallenges((data) => { setChallenges(data); setLoading(false) })
    const u2 = subscribeToGlobalLeaderboard(setGlobalBoard, 10)
    return () => { u1(); u2() }
  }, [])

  useEffect(() => {
    if (!profile?.country) return
    const u = subscribeToCountryLeaderboard(profile.country, setCountryBoard, 10)
    return () => u()
  }, [profile?.country])

  const handleJoin = async (ch) => {
    if (!user) return toast.error('Please sign in to join challenges')
    setJoining(ch.id)
    try {
      await joinChallenge(user.uid, ch.id, profile?.name || 'User', profile?.photoURL || '')
      toast.success(`Joined "${ch.title}"! 🎯`)
    } catch (e) { toast.error('Failed to join: ' + e.message) }
    setJoining(null)
  }

  const colorMap = { green: 'from-eco-600/30 to-teal-600/30', blue: 'from-blue-600/30 to-cyan-600/30', yellow: 'from-yellow-600/30 to-orange-600/30', purple: 'from-purple-600/30 to-pink-600/30' }
  const diffColor = { Easy: 'green', Medium: 'yellow', Hard: 'red' }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoTrophy className="text-eco-400" /> Community Challenges
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <span className="live-dot" /> Live leaderboards · real-time participant counts from Firestore
        </p>
      </motion.div>

      <div className="flex gap-1.5 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl w-fit">
        {[['challenges', '🏆 Challenges'], ['leaderboard', '📊 Leaderboard']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-eco-500/15 text-eco-400 border border-eco-500/25' : 'text-slate-500 hover:text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'challenges' && (
        <>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} className="h-64" />)}
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-20 text-slate-600">
              <div className="text-5xl mb-3">🏆</div>
              <p className="text-lg font-semibold text-slate-400">No challenges yet</p>
              <p className="text-sm mt-1">Challenges are seeded from Firestore. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map((ch, i) => {
                const joined = profile?.joinedChallenges?.includes(ch.id)
                return (
                  <motion.div key={ch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-white/[0.02] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-eco-500/20 transition-all">
                    <div className={`bg-gradient-to-br ${colorMap[ch.color] || colorMap.green} p-5 border-b border-white/[0.04]`}>
                      <div className="text-4xl mb-2">{ch.badge}</div>
                      <h3 className="font-bold text-white">{ch.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{ch.category}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-400 leading-relaxed">{ch.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5"><IoPeople size={12} className="text-eco-400" />{(ch.participants || 0).toLocaleString()} joined</div>
                        <div className="flex items-center gap-1.5"><IoTime size={12} className="text-eco-400" />{ch.duration}</div>
                        <div className="flex items-center gap-1.5">⚡ +{ch.points} pts</div>
                        <div className="flex items-center gap-1.5">🌱 -{ch.co2Impact} kg CO₂</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge color={diffColor[ch.difficulty] || 'gray'}>{ch.difficulty}</Badge>
                        {ch.tags?.slice(0, 2).map(t => <Badge key={t} color="gray">{t}</Badge>)}
                      </div>
                      {joined ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 bg-eco-500/8 rounded-xl text-eco-400 text-xs font-semibold border border-eco-500/15">
                          <IoCheckmarkCircle size={13} /> Joined
                        </div>
                      ) : (
                        <Button className="w-full" size="sm" loading={joining === ch.id} onClick={() => handleJoin(ch)}>Join Challenge</Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </>
      )}

      {tab === 'leaderboard' && (
        <div className="grid lg:grid-cols-2 gap-5">
          {[
            { title: '🌍 Global', data: globalBoard, empty: 'No global data yet' },
            { title: `🇮🇳 ${profile?.country || 'India'}`, data: countryBoard, empty: `No data for ${profile?.country || 'India'}` },
          ].map(({ title, data, empty }) => (
            <div key={title} className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">{title} Top 10</h2>
                <Badge color="green" pulse>Live</Badge>
              </div>
              {data.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-sm">{empty}</div>
              ) : (
                <div className="space-y-2">
                  {data.map((entry, i) => (
                    <div key={entry.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${entry.id === user?.uid ? 'bg-eco-500/8 border border-eco-500/15' : 'bg-white/[0.02]'}`}>
                      <span className="text-sm stat-number text-slate-600 w-5">#{entry.rank}</span>
                      <img src={entry.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.id}`} className="w-7 h-7 rounded-lg" alt="" />
                      <p className={`text-sm flex-1 truncate ${entry.id === user?.uid ? 'text-eco-400' : 'text-slate-300'}`}>{entry.name}</p>
                      <p className="stat-number text-xs font-semibold text-slate-400">{(entry.ecoPoints || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
