import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export function Card({ children, className = '', hover = false, glass = false, onClick, glow = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={clsx(
        'rounded-2xl transition-all duration-300',
        glass
          ? 'glass-card'
          : 'bg-white/[0.02] border border-white/[0.06] shadow-glass-dark',
        hover && 'cursor-pointer hover:border-eco-500/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(34,197,94,0.08)]',
        glow && 'shadow-eco-sm',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export function StatCard({ title, value, subtitle, icon, trend, trendLabel, color = 'eco', loading = false, className = '', delay = 0 }) {
  const colorMap = {
    eco: { bg: 'bg-eco-500/10', text: 'text-eco-400', border: 'border-eco-500/20', glow: 'shadow-eco-sm' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'shadow-[0_4px_24px_rgba(59,130,246,0.2)]' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-[0_4px_24px_rgba(168,85,247,0.2)]' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', glow: 'shadow-[0_4px_24px_rgba(249,115,22,0.2)]' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', glow: 'shadow-[0_4px_24px_rgba(20,184,166,0.2)]' },
  }
  const c = colorMap[color]

  return (
    <Card delay={delay} className={clsx('p-5 group', c.glow, className)} hover>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-white/5 rounded-lg w-24" />
          <div className="h-8 bg-white/5 rounded-lg w-32" />
          <div className="h-3 bg-white/5 rounded-lg w-20" />
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="stat-number text-2xl font-semibold text-white mt-1.5">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            {trend != null && (
              <div className={clsx(
                'inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full',
                trend > 0 ? 'bg-eco-500/10 text-eco-400' : 'bg-red-500/10 text-red-400'
              )}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                {trendLabel && <span className="text-slate-500 font-normal">{trendLabel}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className={clsx(
              'w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110',
              c.bg, `border ${c.border}`
            )}>
              {icon}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
