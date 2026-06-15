import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoLeaf, IoMenu, IoClose, IoMoon, IoSunny,
  IoNotifications, IoChevronDown, IoLogOut, IoSettings, IoPerson
} from 'react-icons/io5'
import { useAuthStore } from '../../store/useAuthStore'
import { useThemeStore } from '../../store/useThemeStore'
import { useNotificationStore } from '../../store/useNotificationStore'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'Benchmark', href: '/benchmark' },
  { label: 'AI Coach', href: '/coach' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'World Map', href: '/map' },
]

export function Navbar({ onlyLogo = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, profile, isAuthenticated, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const avatar = profile?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`
  const displayName = profile?.name || user?.displayName || 'User'

  return (
    <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'glass-strong border-b border-white/[0.06]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 0 16px rgba(34,197,94,0.4)' }}
            >
              <IoLeaf className="text-white" size={18} />
            </motion.div>
            <span className="font-display font-bold text-lg gradient-text">EcoTrack AI</span>
          </Link>

          {/* Desktop Nav */}
          {!onlyLogo && isAuthenticated && (
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.href
                      ? 'bg-eco-500/10 text-eco-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <IoSunny size={18} /> : <IoMoon size={18} />}
            </motion.button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
                    className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
                    aria-label="Notifications"
                  >
                    <IoNotifications size={18} />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-eco-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                        style={{ boxShadow: '0 0 8px rgba(34,197,94,0.8)' }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl border border-white/10 shadow-glass-dark overflow-hidden z-50"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                          <span className="text-sm font-semibold text-white">Notifications</span>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-eco-400 hover:text-eco-300 transition-colors">
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-sm">
                              <div className="text-3xl mb-2">🔔</div>
                              All caught up!
                            </div>
                          ) : (
                            notifications.map(n => (
                              <motion.button
                                key={n.id}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                                onClick={() => markRead(n.id)}
                                className="w-full text-left px-4 py-3 border-b border-white/[0.04] last:border-0"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-xl mt-0.5">{n.icon || '🔔'}</span>
                                  <div>
                                    <p className="text-sm text-slate-200 font-medium">{n.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                                  </div>
                                </div>
                              </motion.button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/8 transition-colors"
                  >
                    <img src={avatar} alt={displayName} className="w-7 h-7 rounded-lg object-cover border border-eco-500/40" />
                    <span className="hidden md:block text-sm font-medium text-slate-300">{displayName.split(' ')[0]}</span>
                    <IoChevronDown size={12} className="hidden md:block text-slate-500" />
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 glass-strong rounded-2xl border border-white/10 shadow-glass-dark overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-white/[0.06]">
                          <p className="font-semibold text-white text-sm truncate">{displayName}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          {profile?.ecoLevelName && (
                            <Badge color="green" className="mt-1.5">{profile.ecoLevelName}</Badge>
                          )}
                        </div>
                        {[
                          { label: 'Profile', icon: <IoPerson size={14} />, href: '/profile' },
                          { label: 'Settings', icon: <IoSettings size={14} />, href: '/settings' },
                        ].map(item => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {item.icon} {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/[0.06]"
                        >
                          <IoLogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/signup"><Button size="sm">Get Started</Button></Link>
              </div>
            )}

            {isAuthenticated && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <IoClose size={20} /> : <IoMenu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-white/[0.06]"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-eco-500/10 text-eco-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
