import { Leaf } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Logo({ className, showText = true }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-eco-400 to-eco-600 text-white shadow-lg shadow-eco-600/30">
        <Leaf size={20} aria-hidden="true" />
      </span>
      {showText ? (
        <span className="text-lg font-extrabold tracking-tight">
          EcoTrack<span className="text-eco-600 dark:text-eco-400"> AI</span>
        </span>
      ) : null}
    </span>
  )
}
