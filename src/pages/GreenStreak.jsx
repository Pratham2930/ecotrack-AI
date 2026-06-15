import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoFlame, IoCheckmarkCircle, IoTrophy } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { logHabit, removeHabit, subscribeToDayHabits, subscribeToStreakData, updateStreak, createNotification } from '../services/firestoreService'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import toast from 'react-hot-toast'

const today = new Date().toISOString().split('T')[0]

const HABITS = [
  { id: 'h1', name: 'Public Transport', icon: '🚌', category: 'Transport', points: 15, co2Saved: 2.4, description: 'Use bus, metro or train' },
  { id: 'h2', name: 'Plant-based Meal', icon: '🥗', category: 'Food', points: 12, co2Saved: 1.2, description: 'Eat at least one veg meal' },
  { id: 'h3', name: 'No Single-use Plastic', icon: '🚫', category: 'Waste', points: 10, co2Saved: 0.5, description: 'Avoid plastic bags & bottles' },
  { id: 'h4', name: 'Lights Off', icon: '💡', category: 'Energy', points: 8, co2Saved: 0.3, description: 'Turn off unused electronics' },
  { id: 'h5', name: 'Walk/Cycle Short Trips', icon: '🚴', category: 'Transport', points: 15, co2Saved: 0.8, description: 'Walk or cycle under 3km' },
  { id: 'h6', name: 'Cold Shower', icon: '🚿', category: 'Energy', points: 10, co2Saved: 0.4, description: 'Take a shorter/cooler shower' },
  { id: 'h7', name: 'Recycle Waste', icon: '♻️', category: 'Waste', points: 12, co2Saved: 0.6, description: 'Properly sort and recycle' },
]

const ACHIEVEMENTS = [
  { id: 'a1', name: 'Beginner Eco Hero', icon: '🌱', desc: '7-day streak', req: 7, rarity: 'Common', points: 100 },
  { id: 'a2', name: 'Green Explorer', icon: '🌿', desc: '30 habits completed', req: 30, rarity: 'Uncommon', points: 250 },
  { id: 'a3', name: 'Sustainability Champion', icon: '🏆', desc: '30-day streak', req: 30, rarity: 'Rare', points: 500 },
  { id: 'a4', name: 'Climate Guardian', icon: '🛡️', desc: 'Save 500kg CO₂', req: 500, rarity: 'Epic', points: 1000 },
  { id: 'a5', name: 'Earth Protector', icon: '🌍', desc: 'Complete 5 challenge types', req: 5, rarity: 'Legendary', points: 2000 },
]

export default function GreenStreak() {
  const [tab, setTab] = useState('habits')
  const [todayHabits, setTodayHabits] = useState([])
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 })
  const [achievement, setAchievement] = useState(null)
  const { user, profile } = useAuthStore()

  useEffect(() => {
    if (!user?.uid) return
    const u1 = subscribeToDayHabits(user.uid, today, setTodayHabits)
    const u2 = subscribeToStreakData(user.uid, setStreakData)
    return () => { u1(); u2() }
  }, [user?.uid])

  const toggleHabit = useCallback(async (habit) => {
    if (!user?.uid) return
    const done = todayHabits.includes(habit.id)
    try {
      if (done) {
        await removeHabit(user.uid, habit, today)
        toast(`-${habit.points} points`, { icon: '↩️' })
      } else {
        await logHabit(user.uid, habit, today)
        toast.success(`+${habit.points} pts · -${habit.co2Saved}kg CO₂ 🌱`)
        // Check if all habits done
        if (todayHabits.length + 1 === HABITS.length) {
          await createNotification(user.uid, { title: '🎉 Perfect Day!', message: 'You completed all habits today!', icon: '🌟', type: 'achievement' })
        }
      }
    } catch (e) { toast.error(e.message) }
  }, [user?.uid, todayHabits])

  const progress = { completed: todayHabits.length, total: HABITS.length, pct: Math.round((todayHabits.length / HABITS.length) * 100) }
  const rarityColor = { Common: 'green', Uncommon: 'blue', Rare: 'teal', Epic: 'purple', Legendary: 'orange' }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoFlame className="text-orange-400" /> Green Streak
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <span className="live-dot" /> Habits saved to Firestore · live progress tracking
        </p>
      </motion.div>

      {/* Streak hero */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #431407, #166534, #0f766e)', border: '1px solid rgba(249,115,22,0.2)' }}>
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="text-center">
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                className="stat-number text-6xl font-black">{streakData.currentStreak || profile?.currentStreak || 0}</motion.p>
              <p className="text-orange-200 text-sm">Day Streak 🔥</p>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3">
              {[
                { l: 'Best Streak', v: `${streakData.longestStreak || profile?.longestStreak || 0}d`, icon: '🏆' },
                { l: 'Eco Points', v: (profile?.ecoPoints || 0).toLocaleString(), icon: '⭐' },
                { l: "Today", v: `${progress.completed}/${progress.total}`, icon: '✅' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-xl mb-0.5">{s.icon}</div>
                  <p className="stat-number font-bold">{s.v}</p>
                  <p className="text-xs text-white/50">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>Daily Goal</span><span>{progress.pct}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <motion.div className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 via-eco-400 to-teal-400"
                initial={{ width: 0 }} animate={{ width: `${progress.pct}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ boxShadow: '0 0 12px rgba(34,197,94,0.5)' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl w-fit">
        {[['habits', "📋 Today's Habits"], ['achievements', '🏆 Achievements']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-eco-500/15 text-eco-400 border border-eco-500/25' : 'text-slate-500 hover:text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'habits' && (
        <div className="space-y-2.5">
          {HABITS.map((habit, i) => {
            const done = todayHabits.includes(habit.id)
            return (
              <motion.button key={habit.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => toggleHabit(habit)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${done ? 'border-eco-500/40 bg-eco-500/6' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15'}`}
                aria-pressed={done}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all shrink-0 ${done ? 'text-white' : 'bg-white/5'}`}
                    style={done ? { background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 0 12px rgba(34,197,94,0.4)' } : {}}>
                    {done ? '✓' : habit.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${done ? 'text-eco-400 line-through' : 'text-slate-200'}`}>{habit.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{habit.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`stat-number text-sm font-semibold ${done ? 'text-eco-500' : 'text-slate-500'}`}>+{habit.points}pts</p>
                    <p className="text-xs text-slate-600">-{habit.co2Saved}kg CO₂</p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {tab === 'achievements' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ACHIEVEMENTS.map((ach, i) => {
            const unlocked = profile?.achievements?.includes(ach.id) ||
              (ach.id === 'a1' && (streakData.currentStreak || 0) >= 7) ||
              (ach.id === 'a3' && (streakData.longestStreak || 0) >= 30)
            return (
              <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                onClick={() => unlocked && setAchievement(ach)}
                className={`p-4 rounded-2xl border text-center transition-all ${unlocked ? 'border-eco-500/30 bg-eco-500/5 cursor-pointer hover:border-eco-500/50' : 'border-white/[0.06] bg-white/[0.02] opacity-50 cursor-default'}`}>
                <div className={`text-4xl mb-2 ${!unlocked ? 'grayscale' : ''}`}>{unlocked ? ach.icon : '🔒'}</div>
                <p className="text-xs font-semibold text-slate-300 leading-tight">{ach.name}</p>
                <Badge color={rarityColor[ach.rarity] || 'gray'} className="mt-2 text-[10px]">{ach.rarity}</Badge>
                <p className="text-[10px] text-slate-600 mt-1.5">{ach.desc}</p>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal isOpen={!!achievement} onClose={() => setAchievement(null)} title="Achievement Unlocked!">
        {achievement && (
          <div className="text-center py-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}
              className="text-7xl mb-4">{achievement.icon}</motion.div>
            <h3 className="text-2xl font-bold text-white">{achievement.name}</h3>
            <Badge color={rarityColor[achievement.rarity] || 'green'} className="mt-2 text-sm px-4 py-1">{achievement.rarity}</Badge>
            <p className="text-slate-400 text-sm mt-3">{achievement.desc}</p>
            <p className="text-eco-400 font-bold text-xl mt-3 stat-number">+{achievement.points} Eco Points</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
