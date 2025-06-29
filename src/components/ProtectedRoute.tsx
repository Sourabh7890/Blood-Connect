import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'donor' | 'recipient' | 'admin'
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If role is required and user doesn't have that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'donor') {
      return <Navigate to="/donor" replace />
    } else if (user?.role === 'recipient') {
      return <Navigate to="/recipient" replace />
    } else if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    // Fallback to home if somehow role is invalid
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute