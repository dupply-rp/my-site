import { Navigate, Outlet } from 'react-router-dom'

import { ConsoleClient } from '@dupply/sdk'

export function ProtectedRoute() {
  if (!ConsoleClient.getStoredToken()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
