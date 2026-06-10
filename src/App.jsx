import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute'
import { Loader } from './components/ui/Primitives'

// Lazy-loaded pages for code splitting / faster initial load.
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Coach = lazy(() => import('./pages/Coach'))
const Recommendations = lazy(() => import('./pages/Recommendations'))
const Goals = lazy(() => import('./pages/Goals'))
const Streak = lazy(() => import('./pages/Streak'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Offset = lazy(() => import('./pages/Offset'))
const Benchmarking = lazy(() => import('./pages/Benchmarking'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const Community = lazy(() => import('./pages/Community'))
const MapPage = lazy(() => import('./pages/MapPage'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Loader />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="coach" element={<Coach />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="goals" element={<Goals />} />
          <Route path="streak" element={<Streak />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="offset" element={<Offset />} />
          <Route path="benchmark" element={<Benchmarking />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="community" element={<Community />} />
          <Route path="map" element={<MapPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
