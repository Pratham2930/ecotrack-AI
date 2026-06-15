import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoLeaf, IoMoon, IoSunny } from 'react-icons/io5'
import { useThemeStore } from '../store/useThemeStore'

export function AuthLayout() {
  const { isDark, toggleTheme } = useThemeStore()
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated bg */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-eco-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute top-4 left-6 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}>
            <IoLeaf className="text-white" size={14} />
          </div>
          <span className="font-display font-bold gradient-text">EcoTrack AI</span>
        </Link>
      </div>
      <div className="absolute top-4 right-6">
        <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors" aria-label="Toggle theme">
          {isDark ? <IoSunny size={18} /> : <IoMoon size={18} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Outlet />
      </motion.div>
    </div>
  )
}
