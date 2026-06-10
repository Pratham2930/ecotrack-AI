import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Calculator,
  Flame,
  Globe2,
  LineChart,
  ShoppingBag,
  Target,
  TreePine,
  Trophy,
} from 'lucide-react'
import { Logo } from '../components/layout/Logo'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import { useAuth } from '../hooks/useAuth'

const FEATURES = [
  { icon: Calculator, title: 'Smart Calculator', text: 'Estimate CO₂ across transport, energy, food and waste with realistic factors.' },
  { icon: LineChart, title: 'Rich Analytics', text: 'Interactive trends, category breakdowns and sustainability score tracking.' },
  { icon: Bot, title: 'AI Climate Coach', text: 'Personalised daily challenges, weekly reports and monthly roadmaps.' },
  { icon: Globe2, title: 'Global Benchmarking', text: 'See how you compare to your city, country and the world.' },
  { icon: Target, title: 'Reduction Goals', text: 'Set goals, track progress and celebrate completion.' },
  { icon: Flame, title: 'Green Streaks', text: 'Build daily eco habits with a Duolingo-style streak system.' },
  { icon: Trophy, title: 'Gamification', text: 'Earn eco points, level up and unlock achievement badges.' },
  { icon: ShoppingBag, title: 'Eco Marketplace', text: 'Discover greener alternatives with real CO₂ savings.' },
  { icon: TreePine, title: 'Carbon Offset', text: 'Translate emissions into trees and real-world equivalences.' },
]

const STATS = [
  { value: '9', label: 'Sustainability tools' },
  { value: '20+', label: 'Countries benchmarked' },
  { value: '5', label: 'Green levels to unlock' },
  { value: '100%', label: 'Open & deployable' },
]

export default function Landing() {
  const { user } = useAuth()
  const ctaTo = user ? '/app' : '/signup'

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 via-white to-eco-100/50 dark:from-earth-950 dark:via-earth-900 dark:to-earth-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link to={ctaTo} className="btn-primary">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-eco-600/20 bg-eco-600/10 px-4 py-1.5 text-sm font-semibold text-eco-700 dark:text-eco-300">
            🌍 Your personal climate companion
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
            Track your carbon footprint.
            <br />
            <span className="bg-gradient-to-r from-eco-500 to-emerald-600 bg-clip-text text-transparent">
              Build a greener future.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-earth-600 dark:text-earth-300">
            EcoTrack AI turns your everyday choices into measurable climate impact — with an AI
            coach, global benchmarking, gamified habits and beautiful analytics.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to={ctaTo} className="btn-primary px-6 py-3 text-base">
              Start tracking free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3 text-base">
              I already have an account
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass p-4">
              <p className="text-2xl font-extrabold text-eco-600 dark:text-eco-400 md:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-earth-600 dark:text-earth-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Everything you need to go green
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-earth-600 dark:text-earth-300">
          A complete sustainability platform that feels like it’s used by millions.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-eco-600/10 text-eco-600 dark:text-eco-400">
                <f.icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-earth-600 dark:text-earth-300">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-eco-600 to-emerald-800 p-10 text-center text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-3xl font-extrabold md:text-4xl">Ready to shrink your footprint?</h2>
          <p className="mx-auto mt-3 max-w-xl text-eco-50/90">
            Join EcoTrack AI and start your journey to net zero — one habit at a time.
          </p>
          <Link
            to={ctaTo}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-eco-700 transition-transform hover:scale-[1.03]"
          >
            Get started for free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-earth-200/60 py-8 text-center text-sm text-earth-500 dark:border-white/10 dark:text-earth-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5">
          <Logo />
          <p>Built for a sustainable planet · EcoTrack AI 🌱</p>
        </div>
      </footer>
    </div>
  )
}
