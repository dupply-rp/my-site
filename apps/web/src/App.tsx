import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AnalyticsTracker } from './components/AnalyticsTracker'
import { WhatsappFloatingButton } from './components/WhatsappFloatingButton'
import { DiagnosticoPage } from './features/diagnostico/DiagnosticoPage'
import { DiagnosticoTestPage } from './features/diagnostico/DiagnosticoTestPage'
import { DataDeletionPage } from './pages/DataDeletionPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import './styles/landing.css'

function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <WhatsappFloatingButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnostico" element={<DiagnosticoPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/exclusao-de-dados" element={<DataDeletionPage />} />
        <Route path="/TC_teste" element={<DiagnosticoTestPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
