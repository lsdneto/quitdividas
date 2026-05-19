import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { DebtorsPage } from './pages/DebtorsPage'
import { DebtDetailsPage } from './pages/DebtDetailsPage'
import { RegisterPaymentPage } from './pages/RegisterPaymentPage'
import { ReportsPage } from './pages/ReportsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/devedores" element={<DebtorsPage />} />
                    <Route path="/devedores/:debtorId" element={<DebtDetailsPage />} />
                    <Route path="/pagamentos/:debtId" element={<RegisterPaymentPage />} />
                    <Route path="/relatorios" element={<ReportsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
