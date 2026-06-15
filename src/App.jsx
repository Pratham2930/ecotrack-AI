import { useEffect, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { useNotificationStore } from './store/useNotificationStore'
import { PublicLayout } from './layouts/PublicLayout'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PageLoader } from './components/ui/LoadingSpinner'

// Pages
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Calculator from './pages/Calculator'
import Benchmark from './pages/Benchmark'
import AICoach from './pages/AICoach'
import Marketplace from './pages/Marketplace'
import Challenges from './pages/Challenges'
import WorldMap from './pages/WorldMap'
import GreenStreak from './pages/GreenStreak'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

export default function App() {
  const { initAuth, isAuthenticated, user } = useAuthStore()
  const { initTheme } = useThemeStore()
  const { init: initNotifications, cleanup } = useNotificationStore()

  useEffect(() => {
    initTheme()
    const unsubAuth = initAuth()
    return () => { if (unsubAuth) unsubAuth() }
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      initNotifications(user.uid)
    } else {
      cleanup()
    }
  }, [isAuthenticated, user?.uid])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/map" element={<WorldMap />} />
          <Route path="/streak" element={<GreenStreak />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
