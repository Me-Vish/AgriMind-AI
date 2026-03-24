import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CropPrediction from './pages/CropPrediction'
import IrrigationPlanner from './pages/IrrigationPlanner'
import DiseaseDetection from './pages/DiseaseDetection'
import ChatAssistant from './pages/ChatAssistant'
import MarketInsights from './pages/MarketInsights'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import { ThemeProvider } from './hooks/useTheme'
import { AuthProvider, useAuth } from './auth/AuthContext'

function ProtectedLayout() {
  const { user } = useAuth()
  return user ? <Layout /> : <Navigate to="/signin" replace />
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<PublicOnly><SignIn /></PublicOnly>} />
            <Route path="/" element={<ProtectedLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="crop-prediction" element={<CropPrediction />} />
              <Route path="irrigation-planner" element={<IrrigationPlanner />} />
              <Route path="disease-detection" element={<DiseaseDetection />} />
              <Route path="chat" element={<ChatAssistant />} />
              <Route path="market" element={<MarketInsights />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
