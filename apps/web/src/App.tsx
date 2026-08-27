import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AnalyticsTracker } from './components/AnalyticsTracker'
import { ThemeToggle } from './components/ThemeToggle'
import { WhatsappFloatingButton } from './components/WhatsappFloatingButton'
import { DiagnosticoPage } from './features/diagnostico/DiagnosticoPage'
import { DiagnosticoTestPage } from './features/diagnostico/DiagnosticoTestPage'
import { DataDeletionPage } from './pages/DataDeletionPage'
import { HomePage } from './pages/HomePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import './styles/landing.css'

function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <ThemeToggle className="theme-toggle theme-toggle-fab" />
      <WhatsappFloatingButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnostico" element={<DiagnosticoPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/exclusao-de-dados" element={<DataDeletionPage />} />
        <Route path="/TC_teste" element={<DiagnosticoTestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
