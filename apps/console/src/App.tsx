import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'

const DiagnosticoListPage = lazy(() =>
  import('./pages/DiagnosticoListPage').then((module) => ({ default: module.DiagnosticoListPage })),
)
const DiagnosticoDetailPage = lazy(() =>
  import('./pages/DiagnosticoDetailPage').then((module) => ({ default: module.DiagnosticoDetailPage })),
)
const NotifyEmailsPage = lazy(() =>
  import('./pages/NotifyEmailsPage').then((module) => ({ default: module.NotifyEmailsPage })),
)

function App() {
  return (
    <BrowserRouter basename="/console">
      <Suspense fallback={<div className="container page-loading">Carregando módulo…</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DiagnosticoListPage />} />
            <Route path="/diagnosticos/:id" element={<DiagnosticoDetailPage />} />
            <Route path="/emails" element={<NotifyEmailsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
