import { Navigate, Outlet } from 'react-router-dom'

import { getConsoleToken } from '../lib/api'

export function ProtectedRoute() {
  if (!getConsoleToken()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
