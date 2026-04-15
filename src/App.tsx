import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { LandingPage } from './pages/LandingPage'
import { AiConsultPage } from './pages/AiConsultPage'
import { ServicesPage } from './pages/ServicesPage'
import { StudentsPage } from './pages/StudentsPage'
import { AboutPage } from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ai" element={<AiConsultPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
