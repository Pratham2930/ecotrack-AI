import { cn } from '../../utils/cn'

/** Glassmorphism container card. */
export function Card({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('glass p-5 md:p-6', className)} {...props}>
      {children}
    </Tag>
  )
}

/** Page section heading with optional icon + description. */
export function SectionHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-eco-600/10 text-eco-600 dark:text-eco-400">
            <Icon size={20} aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-earth-700 dark:text-earth-200">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  )
}

/** Compact KPI / statistic card. */
export function StatCard({ icon: Icon, label, value, sub, tone = 'eco', className }) {
  const tones = {
    eco: 'from-eco-500/15 to-eco-600/5 text-eco-600 dark:text-eco-400',
    amber: 'from-amber-500/15 to-amber-600/5 text-amber-600 dark:text-amber-400',
    sky: 'from-sky-500/15 to-sky-600/5 text-sky-600 dark:text-sky-400',
    violet: 'from-violet-500/15 to-violet-600/5 text-violet-600 dark:text-violet-400',
  }
  return (
    <Card className={cn('animate-fade-in', className)}>
      <div className="flex items-center justify-between">
        <p className="card-title">{label}</p>
        {Icon ? (
          <span
            className={cn(
              'grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br',
              tones[tone] || tones.eco,
            )}
          >
            <Icon size={18} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
      {sub ? (
        <p className="mt-1 text-xs text-earth-600 dark:text-earth-300">{sub}</p>
      ) : null}
    </Card>
  )
}

/** Accessible labelled progress bar. */
export function ProgressBar({ value = 0, max = 100, label, tone = 'eco', className }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const tones = {
    eco: 'bg-eco-500',
    amber: 'bg-amber-500',
    sky: 'bg-sky-500',
    violet: 'bg-violet-500',
  }
  return (
    <div className={className}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-earth-700 dark:text-earth-200">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-earth-200/70 dark:bg-white/10"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'progress'}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-700', tones[tone] || tones.eco)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/** Circular sustainability score ring. */
export function ScoreRing({ score = 0, size = 132, stroke = 12, label = 'Score' }) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ
  const color =
    score >= 80 ? '#10b981' : score >= 60 ? '#84cc16' : score >= 40 ? '#f59e0b' : score >= 20 ? '#f97316' : '#ef4444'
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-earth-200/70 dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-extrabold" style={{ color }}>
          {Math.round(score)}
        </p>
        <p className="text-[11px] font-medium uppercase tracking-wide text-earth-600 dark:text-earth-300">
          {label}
        </p>
      </div>
    </div>
  )
}

/** Coloured pill / tag. */
export function Pill({ children, tone = 'eco', className }) {
  const tones = {
    eco: 'bg-eco-500/15 text-eco-700 dark:text-eco-300',
    amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    red: 'bg-red-500/15 text-red-700 dark:text-red-300',
    sky: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    slate: 'bg-earth-500/15 text-earth-700 dark:text-earth-200',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone] || tones.eco,
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Loading spinner. */
export function Loader({ label = 'Loading…', className }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-12 text-earth-600 dark:text-earth-300', className)}>
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-eco-500/30 border-t-eco-500"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

/** Empty-state placeholder. */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      {Icon ? (
        <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-eco-600/10 text-eco-600 dark:text-eco-400">
          <Icon size={26} aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-earth-600 dark:text-earth-300">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  )
}
