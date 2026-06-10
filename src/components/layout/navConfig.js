import {
  LayoutDashboard,
  Calculator,
  LineChart,
  Bot,
  Lightbulb,
  Target,
  Flame,
  Trophy,
  TreePine,
  Globe2,
  ShoppingBag,
  Users,
  Map,
  UserCog,
} from 'lucide-react'

/** Primary navigation items for the authenticated app shell. */
export const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/calculator', label: 'Calculator', icon: Calculator },
  { to: '/app/analytics', label: 'Analytics', icon: LineChart },
  { to: '/app/coach', label: 'AI Coach', icon: Bot },
  { to: '/app/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/app/goals', label: 'Goals', icon: Target },
  { to: '/app/streak', label: 'Green Streak', icon: Flame },
  { to: '/app/achievements', label: 'Achievements', icon: Trophy },
  { to: '/app/offset', label: 'Carbon Offset', icon: TreePine },
  { to: '/app/benchmark', label: 'Benchmarking', icon: Globe2 },
  { to: '/app/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/map', label: 'World Map', icon: Map },
  { to: '/app/profile', label: 'Profile', icon: UserCog },
]
