import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DiagnosticoPage } from './features/diagnostico/DiagnosticoPage'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnostico" element={<DiagnosticoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
