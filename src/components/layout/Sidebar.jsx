import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IoLeaf, IoGrid, IoCalculator, IoEarth, IoChatbubbleEllipses,
  IoCart, IoTrophy, IoMap, IoFlame, IoPerson, IoSettings, IoLogOut,
  IoArrowForward,
} from 'react-icons/io5'
import { useAuthStore } from '../../store/useAuthStore'
import { useNotificationStore } from '../../store/useNotificationStore'
import { ProgressBar } from '../ui/ProgressBar'

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: IoGrid, href: '/dashboard' },
      { label: 'Calculator', icon: IoCalculator, href: '/calculator' },
      { label: 'Benchmark', icon: IoEarth, href: '/benchmark' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'AI Coach', icon: IoChatbubbleEllipses, href: '/coach', badge: 'AI' },
      { label: 'Marketplace', icon: IoCart, href: '/marketplace' },
      { label: 'World Map', icon: IoMap, href: '/map' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Challenges', icon: IoTrophy, href: '/challenges' },
      { label: 'Green Streak', icon: IoFlame, href: '/streak', streakBadge: true },
    ],
  },
]

export function Sidebar() {
  const { profile, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const navigate = useNavigate()

  const avatar = profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`
  const levelProgress = ((profile?.ecoPoints || 0) % 1000) / 10

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-r border-white/[0.05] bg-[#030712]/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 0 16px rgba(34,197,94,0.3)' }}>
          <IoLeaf className="text-white" size={16} />
        </div>
        <span className="font-display font-bold text-base gradient-text">EcoTrack AI</span>
      </div>

      {/* User Card */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img src={avatar} alt={profile?.name} className="w-9 h-9 rounded-xl border border-eco-500/30 object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-eco-500 rounded-full border-2 border-[#030712]"
              style={{ boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile?.name || 'User'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <IoFlame className="text-orange-400 shrink-0" size={10} />
              <span className="text-[10px] text-slate-500">{profile?.currentStreak || 0} day streak</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold text-eco-400 stat-number">{(profile?.ecoPoints || 0).toLocaleString()}</p>
            <p className="text-[10px] text-slate-600">pts</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-slate-600 mb-1">
            <span>Lvl {profile?.ecoLevel || 1}</span>
            <span>{levelProgress.toFixed(0)}%</span>
          </div>
          <ProgressBar value={levelProgress} max={100} color="gradient" size="xs" animated glowColor="rgba(34,197,94,0.5)" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-hide py-1" aria-label="Sidebar">
        {navGroups.map(group => (
          <div key={group.label} className="mb-4">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      isActive
                        ? 'nav-active'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={16} className={isActive ? 'text-eco-400' : 'text-slate-500 group-hover:text-slate-300'} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-eco-500/15 text-eco-400 rounded-md border border-eco-500/20">
                          {item.badge}
                        </span>
                      )}
                      {item.streakBadge && profile?.currentStreak > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500/15 text-orange-400 rounded-md">
                          {profile.currentStreak}🔥
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/[0.05] space-y-0.5">
        {[
          { label: 'Profile', icon: IoPerson, href: '/profile' },
          { label: 'Settings', icon: IoSettings, href: '/settings' },
        ].map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'text-eco-400 bg-eco-500/10' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <IoLogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
