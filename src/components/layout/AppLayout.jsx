import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, Sparkles, X } from 'lucide-react'
import { NAV_ITEMS } from './navConfig'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../../hooks/useAuth'
import { useUserData } from '../../hooks/useUserData'
import { cn } from '../../utils/cn'

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-eco-600 text-white shadow-md shadow-eco-600/25'
                : 'text-earth-700 hover:bg-eco-100/70 dark:text-earth-200 dark:hover:bg-white/10',
            )
          }
        >
          <item.icon size={18} aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { level, points } = useUserData()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-white to-eco-100/40 dark:from-earth-950 dark:via-earth-900 dark:to-earth-950">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-eco-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex max-w-[1500px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-earth-200/60 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-earth-900/40 lg:flex">
          <div className="px-2 py-2">
            <Logo />
          </div>
          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <NavItems />
          </div>
          <LevelCard level={level} points={points} />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-earth-950/50 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <motion.aside
                className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-4 dark:bg-earth-900"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <Logo />
                  <button
                    type="button"
                    className="btn-ghost h-9 w-9 p-0"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="mt-4 flex-1 overflow-y-auto">
                  <NavItems onNavigate={() => setMobileOpen(false)} />
                </div>
                <LevelCard level={level} points={points} />
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Main column */}
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-earth-200/60 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-earth-900/50 md:px-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-ghost h-9 w-9 p-0 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div className="lg:hidden">
                <Logo showText={false} />
              </div>
              <p className="hidden text-sm font-medium text-earth-600 dark:text-earth-300 sm:block">
                {greeting()}, <span className="font-semibold text-earth-900 dark:text-white">{user?.displayName?.split('@')[0] || 'Eco Hero'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-eco-600/10 px-3 py-1.5 text-sm font-semibold text-eco-700 dark:text-eco-300 sm:flex">
                <Sparkles size={15} /> {points} pts
              </span>
              <ThemeToggle />
              <button
                type="button"
                onClick={handleLogout}
                className="btn-secondary h-9 gap-1.5 px-3"
                aria-label="Log out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <main
            id="main-content"
            key={location.pathname}
            className="flex-1 animate-fade-in px-4 py-6 md:px-6 lg:px-8"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function LevelCard({ level, points }) {
  return (
    <div className="mt-4 rounded-2xl bg-gradient-to-br from-eco-600 to-eco-800 p-4 text-white shadow-lg">
      <p className="text-xs font-medium uppercase tracking-wide text-eco-100/80">Current Level</p>
      <p className="mt-1 flex items-center gap-2 text-lg font-bold">
        <span aria-hidden="true">{level.current.icon}</span>
        {level.current.name}
      </p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white transition-all duration-700"
          style={{ width: `${level.progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-eco-100/90">
        {level.next ? `${points}/${level.next.minPoints} pts to ${level.next.name}` : 'Max level reached!'}
      </p>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
