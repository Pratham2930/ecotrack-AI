import { useEffect, useRef, useState } from 'react'
import { Bot, CalendarDays, Map as MapIcon, Send, Sparkles, Target } from 'lucide-react'
import { Card, Pill, SectionHeader } from '../components/ui/Primitives'
import { useUserData } from '../hooks/useUserData'
import { askCoach } from '../services/coachService'
import {
  generateDailyChallenge,
  generateMonthlyRoadmap,
  generateWeeklyReport,
} from '../utils/coach'
import { formatKg } from '../utils/carbon'
import { cn } from '../utils/cn'

const SUGGESTIONS = [
  'What is my biggest emission source?',
  'Give me a weekly plan',
  'How can I reduce transport emissions?',
  'Tips to cut home energy use',
]

export default function Coach() {
  const { entries, stats, latest } = useUserData()
  const [tab, setTab] = useState('chat')

  return (
    <div>
      <SectionHeader
        icon={Bot}
        title="AI Climate Coach"
        description="Your personal sustainability assistant — analysing your data to deliver challenges, reports and tailored advice."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton active={tab === 'chat'} onClick={() => setTab('chat')} icon={Sparkles}>
          Chat
        </TabButton>
        <TabButton active={tab === 'daily'} onClick={() => setTab('daily')} icon={CalendarDays}>
          Daily Challenge
        </TabButton>
        <TabButton active={tab === 'weekly'} onClick={() => setTab('weekly')} icon={Target}>
          Weekly Report
        </TabButton>
        <TabButton active={tab === 'monthly'} onClick={() => setTab('monthly')} icon={MapIcon}>
          Monthly Roadmap
        </TabButton>
      </div>

      {tab === 'chat' && <ChatPanel context={{ entries, stats }} />}
      {tab === 'daily' && <DailyPanel latest={latest} />}
      {tab === 'weekly' && <WeeklyPanel entries={entries} stats={stats} />}
      {tab === 'monthly' && <MonthlyPanel entries={entries} />}
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
        active
          ? 'bg-eco-600 text-white shadow-md shadow-eco-600/25'
          : 'glass text-earth-700 hover:bg-eco-100/60 dark:text-earth-200',
      )}
    >
      <Icon size={16} /> {children}
    </button>
  )
}

function ChatPanel({ context }) {
  const [messages, setMessages] = useState([
    {
      role: 'coach',
      text: "Hi! I'm your AI Climate Coach 🌍 Ask me anything about reducing your carbon footprint.",
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const content = (text ?? input).trim()
    if (!content || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: content }])
    setBusy(true)
    const { reply } = await askCoach(content, context)
    setMessages((m) => [...m, { role: 'coach', text: reply }])
    setBusy(false)
  }

  return (
    <Card className="flex h-[60vh] flex-col p-0">
      <div className="flex-1 space-y-4 overflow-y-auto p-5" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                m.role === 'user'
                  ? 'bg-eco-600 text-white'
                  : 'bg-white/70 text-earth-800 dark:bg-white/10 dark:text-earth-100',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {busy ? (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white/70 px-4 py-3 dark:bg-white/10">
              <span className="flex gap-1">
                <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
              </span>
            </div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="border-t border-earth-200/60 p-4 dark:border-white/10">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-eco-600/30 px-3 py-1 text-xs font-medium text-eco-700 transition-colors hover:bg-eco-50 dark:text-eco-300 dark:hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex gap-2"
        >
          <label htmlFor="coach-input" className="sr-only">
            Ask the coach
          </label>
          <input
            id="coach-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about reducing your footprint…"
            className="input"
            autoComplete="off"
          />
          <button type="submit" className="btn-primary px-4" disabled={busy} aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
      </div>
    </Card>
  )
}

function Dot({ delay = '0s' }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-eco-500"
      style={{ animationDelay: delay }}
    />
  )
}

function DailyPanel({ latest }) {
  const challenge = generateDailyChallenge(latest)
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-eco-600/15 text-3xl">
        🎯
      </div>
      <h2 className="mt-4 text-xl font-bold">Today’s Eco Challenge</h2>
      <p className="mt-2 text-lg text-earth-700 dark:text-earth-200">{challenge.text}</p>
      <Pill className="mt-4">+{challenge.points} eco points</Pill>
      <p className="mt-4 text-sm text-earth-500">
        Complete it and log it on the Green Streak page to keep your streak going.
      </p>
    </Card>
  )
}

function WeeklyPanel({ entries, stats }) {
  const report = generateWeeklyReport({ entries, stats })
  return (
    <Card className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{report.title}</h2>
        <Pill tone="slate">{report.period}</Pill>
      </div>
      <ul className="mt-4 space-y-2">
        {report.highlights.map((h, i) => (
          <li key={i} className="flex gap-2 text-sm text-earth-700 dark:text-earth-200">
            <span className="text-eco-600">•</span> {h}
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-xl bg-eco-600/10 p-4">
        <p className="text-sm font-semibold text-eco-700 dark:text-eco-300">This week’s focus</p>
        <p className="mt-1 text-earth-800 dark:text-earth-100">{report.focus}</p>
      </div>
      {report.actions.length ? (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">Recommended actions</p>
          <ul className="space-y-2">
            {report.actions.map((a, i) => (
              <li key={i} className="rounded-lg bg-white/50 px-3 py-2 text-sm dark:bg-white/5">
                {a}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  )
}

function MonthlyPanel({ entries }) {
  const roadmap = generateMonthlyRoadmap(entries)
  return (
    <Card className="mx-auto max-w-2xl">
      <h2 className="text-xl font-bold">{roadmap.title}</h2>
      <p className="mt-2 rounded-xl bg-eco-600/10 p-3 text-sm font-semibold text-eco-700 dark:text-eco-300">
        {roadmap.target}
      </p>
      <ol className="mt-5 space-y-4">
        {roadmap.milestones.map((m, i) => (
          <li key={i} className="relative pl-8">
            <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-eco-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="text-sm font-semibold">{m.week}</p>
            <p className="text-sm text-earth-700 dark:text-earth-200">{m.goal}</p>
            {m.saving > 0 ? (
              <p className="text-xs text-eco-600 dark:text-eco-400">Potential saving ~{formatKg(m.saving)} CO₂e</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Card>
  )
}
