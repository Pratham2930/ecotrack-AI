import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { PageLoader } from '../components/ui/LoadingSpinner'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) return <PageLoader text="Checking authentication..." />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
