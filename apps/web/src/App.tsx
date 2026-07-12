import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DiagnosticoPage } from './features/diagnostico/DiagnosticoPage'
import { DiagnosticoTestPage } from './features/diagnostico/DiagnosticoTestPage'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnostico" element={<DiagnosticoPage />} />
        <Route path="/TC_teste" element={<DiagnosticoTestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
