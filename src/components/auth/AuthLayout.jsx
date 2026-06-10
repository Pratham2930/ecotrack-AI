import { Link } from 'react-router-dom'
import { Globe2, Leaf, LineChart, Sparkles } from 'lucide-react'
import { Logo } from '../layout/Logo'
import { ThemeToggle } from '../layout/ThemeToggle'
import { isFirebaseConfigured } from '../../firebase/config'

const HIGHLIGHTS = [
  { icon: LineChart, text: 'Track and visualise your carbon footprint' },
  { icon: Sparkles, text: 'AI Climate Coach with personalised plans' },
  { icon: Globe2, text: 'Benchmark against users worldwide' },
]

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / marketing panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-eco-700 via-eco-800 to-emerald-950 p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-eco-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <Link to="/" className="relative z-10 inline-flex">
          <Logo />
        </Link>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Measure. Reduce. <span className="text-eco-300">Restore.</span>
          </h2>
          <p className="mt-4 text-eco-100/90">
            Join a global community turning everyday choices into measurable climate impact.
          </p>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                  <Icon size={18} />
                </span>
                <span className="text-sm text-eco-50/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 flex items-center gap-2 text-xs text-eco-100/70">
          <Leaf size={14} /> Every tonne counts. 🌍
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-5 py-10 sm:px-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-1.5 text-sm text-earth-600 dark:text-earth-300">{subtitle}</p>

          {!isFirebaseConfigured ? (
            <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-2.5 text-xs text-amber-700 dark:text-amber-300">
              <strong>Demo mode:</strong> Firebase isn’t configured, so accounts are stored
              locally in your browser. Add credentials in <code>.env</code> to enable Firebase.
            </div>
          ) : null}

          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 text-sm">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}
