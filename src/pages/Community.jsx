import { useMemo, useState } from 'react'
import { CheckCircle2, Crown, Trophy, Users } from 'lucide-react'
import { Card, Pill, SectionHeader } from '../components/ui/Primitives'
import { useAuth } from '../hooks/useAuth'
import { useUserData } from '../hooks/useUserData'
import { joinChallenge, updateChallenge } from '../services/dataService'
import { CHALLENGES, LEADERBOARD_SEED } from '../data/challenges'
import { getCountry } from '../data/countries'
import { cn } from '../utils/cn'

const SCOPES = ['Global', 'Country', 'City', 'Friends']

export default function Community() {
  const { user } = useAuth()
  const { points, challenges, profile, score } = useUserData()
  const [scope, setScope] = useState('Global')

  const me = {
    name: user?.displayName?.split('@')[0] || 'You',
    country: profile.country || '—',
    city: profile.city || '—',
    points,
    score,
    isMe: true,
  }

  const leaderboard = useMemo(() => {
    let pool = [...LEADERBOARD_SEED]
    if (scope === 'Country' && profile.country) {
      pool = pool.filter((u) => u.country === profile.country)
    } else if (scope === 'City' && profile.city) {
      pool = pool.filter((u) => u.city === profile.city)
    } else if (scope === 'Friends') {
      pool = pool.slice(0, 5)
    }
    return [...pool, me].sort((a, b) => b.points - a.points)
  }, [scope, profile, me])

  const joinedIds = new Set(challenges.map((c) => c.id))

  return (
    <div>
      <SectionHeader
        icon={Users}
        title="Community Challenges"
        description="Compete on global leaderboards and join challenges to earn reward points and badges."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Leaderboard */}
        <div className="lg:col-span-3">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Leaderboard</h2>
              <div className="flex flex-wrap gap-1.5">
                {SCOPES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    aria-pressed={scope === s}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold transition-all',
                      scope === s
                        ? 'bg-eco-600 text-white'
                        : 'bg-earth-100 text-earth-600 hover:bg-eco-100 dark:bg-white/10 dark:text-earth-200',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <ul className="space-y-2">
              {leaderboard.map((u, i) => {
                const country = getCountry(u.country)
                return (
                  <li
                    key={`${u.name}-${i}`}
                    className={cn(
                      'flex items-center gap-3 rounded-xl p-3',
                      u.isMe ? 'bg-eco-600/15 ring-1 ring-eco-500/40' : 'bg-white/40 dark:bg-white/5',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold',
                        i === 0
                          ? 'bg-amber-400 text-white'
                          : i === 1
                            ? 'bg-earth-300 text-white'
                            : i === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-earth-100 text-earth-500 dark:bg-white/10',
                      )}
                    >
                      {i < 3 ? <Crown size={15} /> : i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {u.name} {u.isMe ? <span className="text-eco-600">(you)</span> : null}
                      </p>
                      <p className="text-xs text-earth-500">
                        {country ? `${country.flag} ${country.name}` : u.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-eco-600 dark:text-eco-400">{u.points} pts</p>
                      <p className="text-xs text-earth-500">score {u.score}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        {/* Challenges */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-lg font-bold">Active Challenges</h2>
            <div className="space-y-3">
              {CHALLENGES.map((ch) => {
                const joined = joinedIds.has(ch.id)
                const mine = challenges.find((c) => c.id === ch.id)
                return (
                  <div key={ch.id} className="rounded-xl border border-earth-200/60 p-4 dark:border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl" aria-hidden="true">{ch.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold">{ch.title}</h3>
                        <p className="text-xs text-earth-500">{ch.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Pill tone="eco">+{ch.points} pts</Pill>
                        <Pill tone="slate">{ch.durationDays}d</Pill>
                      </div>
                      {joined ? (
                        mine?.completed ? (
                          <Pill tone="eco">
                            <CheckCircle2 size={12} /> Done
                          </Pill>
                        ) : (
                          <button
                            onClick={() => updateChallenge(user.uid, ch.id, { completed: true, progress: 100 }, ch.points)}
                            className="btn-primary h-8 px-3 text-xs"
                          >
                            Complete
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => joinChallenge(user.uid, ch.id)}
                          className="btn-secondary h-8 px-3 text-xs"
                        >
                          Join
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] text-earth-400">
                      <Trophy size={11} className="mr-1 inline" />
                      {ch.participants.toLocaleString()} participants
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
