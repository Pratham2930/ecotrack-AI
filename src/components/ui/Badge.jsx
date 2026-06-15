import { clsx } from 'clsx'

const colorMap = {
  green: 'bg-eco-500/10 text-eco-400 border border-eco-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  teal: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  gray: 'bg-white/5 text-slate-400 border border-white/10',
  white: 'bg-white/10 text-white border border-white/20',
}

export function Badge({ children, color = 'green', className = '', icon, pulse = false }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorMap[color],
      className,
    )}>
      {pulse && <span className="live-dot mr-0.5" />}
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}
