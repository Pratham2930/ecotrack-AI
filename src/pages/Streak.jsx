import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award, Flame, Trophy } from 'lucide-react'
import { Card, Loader, ProgressBar, SectionHeader, StatCard } from '../components/ui/Primitives'
import { useAuth } from '../hooks/useAuth'
import { useUserData } from '../hooks/useUserData'
import { toggleHabit } from '../services/dataService'
import { DAILY_HABITS } from '../data/challenges'
import { toISODate } from '../utils/gamification'
import { cn } from '../utils/cn'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function Streak() {
  const { user } = useAuth()
  const { loading, habitLog, streak, level } = useUserData()
  const today = toISODate()
  const todays = habitLog[today] || []

  const last7 = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = toISODate(d)
      days.push({
        key,
        label: DAY_LABELS[d.getDay()],
        active: (habitLog[key] || []).length > 0,
        isToday: key === today,
      })
    }
    return days
  }, [habitLog, today])

  const weeklyCount = last7.filter((d) => d.active).length

  if (loading) return <Loader />

  return (
    <div>
      <SectionHeader
        icon={Flame}
        title="Green Streak"
        description="Build sustainable daily habits. Log at least one eco action each day to keep your streak alive."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Flame} label="Current Streak" value={`${streak.currentStreak} days`} tone="amber" />
        <StatCard icon={Trophy} label="Longest Streak" value={`${streak.longestStreak} days`} tone="eco" />
        <StatCard icon={Award} label="This Week" value={`${weeklyCount}/7 days`} tone="violet" />
        <StatCard icon={Flame} label="Level" value={level.current.name} sub={`Level ${level.level}`} tone="sky" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Today's habits */}
        <Card className="lg:col-span-2">
          <h2 className="mb-1 text-lg font-bold">Today’s Eco Habits</h2>
          <p className="mb-4 text-sm text-earth-600 dark:text-earth-300">
            Tap each habit you completed today. Each one earns eco points.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {DAILY_HABITS.map((h) => {
              const done = todays.includes(h.id)
              return (
                <motion.button
                  key={h.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleHabit(user.uid, today, h.id, h.points)}
                  aria-pressed={done}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                    done
                      ? 'border-eco-600 bg-eco-600/10'
                      : 'border-earth-200 hover:border-eco-400 dark:border-white/10',
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">{h.icon}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{h.label}</span>
                    <span className="text-xs text-earth-500">+{h.points} points</span>
                  </span>
                  <span
                    className={cn(
                      'grid h-6 w-6 place-items-center rounded-full border-2 text-xs font-bold',
                      done
                        ? 'border-eco-600 bg-eco-600 text-white'
                        : 'border-earth-300 text-transparent dark:border-white/20',
                    )}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                </motion.button>
              )
            })}
          </div>
        </Card>

        {/* Week view + level */}
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-bold">Last 7 Days</h2>
            <div className="flex items-end justify-between gap-1">
              {last7.map((d) => (
                <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={cn(
                      'grid h-12 w-full place-items-center rounded-lg text-lg transition-colors',
                      d.active
                        ? 'bg-gradient-to-br from-eco-400 to-eco-600 text-white shadow-md'
                        : 'bg-earth-100 text-earth-300 dark:bg-white/5',
                      d.isToday && 'ring-2 ring-eco-500 ring-offset-2 ring-offset-white dark:ring-offset-earth-900',
                    )}
                  >
                    {d.active ? '🔥' : ''}
                  </div>
                  <span className="text-xs font-medium text-earth-500">{d.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">{level.current.icon}</span>
              <h2 className="text-lg font-bold">{level.current.name}</h2>
            </div>
            <div className="mt-4">
              <ProgressBar value={level.progress} label="Progress to next level" tone="eco" />
            </div>
            <p className="mt-2 text-xs text-earth-500">
              {level.next ? `Reach ${level.next.minPoints} pts for ${level.next.name}` : 'You’ve reached the highest level!'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
