import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export function ProgressBar({ value, max = 100, color = 'eco', size = 'md', label, showValue = false, animated = true, className = '', glowColor }) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  const colorMap = {
    eco: 'bg-eco-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    teal: 'bg-teal-500',
    gradient: 'bg-gradient-to-r from-eco-500 to-teal-400',
    gold: 'bg-gradient-to-r from-yellow-400 to-orange-400',
  }
  const sizeMap = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3', xl: 'h-4' }

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-slate-300 stat-number">{pct}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-white/5 rounded-full overflow-hidden', sizeMap[size])}>
        <motion.div
          className={clsx('h-full rounded-full', colorMap[color])}
          style={glowColor ? { boxShadow: `0 0 8px ${glowColor}` } : {}}
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

export function CircularProgress({ value, max = 100, size = 120, strokeWidth = 8, color = '#22c55e', trackColor, children, glowColor }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(100, (value / max) * 100)
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" style={{ filter: glowColor ? `drop-shadow(0 0 8px ${glowColor})` : 'none' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor || 'rgba(255,255,255,0.05)'} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeLinecap="round"
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || <span className="stat-number text-2xl font-semibold text-white">{value}</span>}
      </div>
    </div>
  )
}
