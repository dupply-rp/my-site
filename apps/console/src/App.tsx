import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { DiagnosticoDetailPage } from './pages/DiagnosticoDetailPage'
import { DiagnosticoListPage } from './pages/DiagnosticoListPage'
import { LoginPage } from './pages/LoginPage'

function App() {
  return (
    <BrowserRouter basename="/console">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DiagnosticoListPage />} />
          <Route path="/diagnosticos/:id" element={<DiagnosticoDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
