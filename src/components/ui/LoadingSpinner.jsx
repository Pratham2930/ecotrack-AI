import { motion } from 'framer-motion'

export function LoadingSpinner({ size = 'md', text }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeMap[size]} relative`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full rounded-full border-2 border-transparent border-t-eco-500"
          style={{ boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}
        />
        <div className="absolute inset-1 rounded-full border border-white/5" />
      </div>
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  )
}

export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-[#030712] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-float">🌱</div>
        <LoadingSpinner size="lg" />
        <p className="text-slate-400 mt-4 text-sm">{text}</p>
      </div>
    </div>
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="flex justify-between">
          <div className="h-3 bg-white/5 rounded w-24" />
          <div className="h-8 w-8 bg-white/5 rounded-xl" />
        </div>
        <div className="h-7 bg-white/5 rounded w-32" />
        <div className="h-2 bg-white/5 rounded w-20" />
      </div>
    </div>
  )
}
