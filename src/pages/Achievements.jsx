import { Lock, Sparkles, Trophy } from 'lucide-react'
import { Card, Loader, ProgressBar, SectionHeader, StatCard } from '../components/ui/Primitives'
import { useUserData } from '../hooks/useUserData'
import { GREEN_LEVELS } from '../utils/gamification'
import { cn } from '../utils/cn'

export default function Achievements() {
  const { loading, badges, points, level, stats } = useUserData()
  if (loading) return <Loader />

  const earned = badges.filter((b) => b.earned).length

  return (
    <div>
      <SectionHeader
        icon={Trophy}
        title="Achievements"
        description="Earn eco points, climb the green level system and unlock achievement badges."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Sparkles} label="Eco Points" value={points} tone="violet" />
        <StatCard icon={Trophy} label="Badges Earned" value={`${earned}/${badges.length}`} tone="eco" />
        <StatCard icon={Trophy} label="Green Level" value={`Lvl ${level.level}`} sub={level.current.name} tone="amber" />
      </div>

      {/* Level system */}
      <Card className="mt-6">
        <h2 className="mb-4 text-lg font-bold">Green Level System</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GREEN_LEVELS.map((lvl, i) => {
            const reached = points >= lvl.minPoints
            const isCurrent = level.current.key === lvl.key
            return (
              <div
                key={lvl.key}
                className={cn(
                  'rounded-xl border p-4 text-center transition-all',
                  isCurrent
                    ? 'border-eco-600 bg-eco-600/10 shadow-md'
                    : reached
                      ? 'border-eco-400/40 bg-white/40 dark:bg-white/5'
                      : 'border-earth-200 opacity-60 dark:border-white/10',
                )}
              >
                <div className="text-3xl" aria-hidden="true">{lvl.icon}</div>
                <p className="mt-2 text-sm font-bold">{lvl.name}</p>
                <p className="text-xs text-earth-500">{lvl.minPoints}+ pts</p>
                {isCurrent ? (
                  <span className="mt-2 inline-block rounded-full bg-eco-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    YOU
                  </span>
                ) : null}
                <span className="mt-1 block text-[10px] font-semibold text-earth-400">
                  Level {i + 1}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-5">
          <ProgressBar value={level.progress} label={`Progress to ${level.next?.name || 'max level'}`} />
        </div>
      </Card>

      {/* Badges */}
      <Card className="mt-6">
        <h2 className="mb-4 text-lg font-bold">Achievement Badges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={cn(
                'relative flex flex-col items-center rounded-xl border p-4 text-center transition-all',
                b.earned
                  ? 'animate-pop-in border-eco-500/40 bg-gradient-to-br from-eco-500/10 to-emerald-600/5'
                  : 'border-earth-200 dark:border-white/10',
              )}
            >
              <div className={cn('text-4xl', !b.earned && 'opacity-30 grayscale')} aria-hidden="true">
                {b.icon}
              </div>
              <p className="mt-2 text-sm font-bold">{b.name}</p>
              <p className="mt-0.5 text-xs text-earth-500">{b.description}</p>
              {b.earned ? (
                <span className="mt-2 rounded-full bg-eco-600/15 px-2 py-0.5 text-[10px] font-bold text-eco-700 dark:text-eco-300">
                  UNLOCKED
                </span>
              ) : (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-earth-200/60 px-2 py-0.5 text-[10px] font-bold text-earth-500 dark:bg-white/10">
                  <Lock size={10} /> LOCKED
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Stats footer */}
      <Card className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Your Stats</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Footprints logged" value={stats.entries} />
          <MiniStat label="Goals completed" value={stats.goalsCompleted} />
          <MiniStat label="Challenges done" value={stats.challengesCompleted} />
          <MiniStat label="Best score" value={`${stats.bestScore}/100`} />
        </div>
      </Card>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-eco-600/10 p-3 text-center">
      <p className="text-2xl font-extrabold text-eco-700 dark:text-eco-300">{value}</p>
      <p className="text-xs text-earth-500">{label}</p>
    </div>
  )
}
