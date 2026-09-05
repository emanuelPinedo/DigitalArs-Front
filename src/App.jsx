import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Deposit from './pages/Deposit'
import Transferencias from './pages/Transferencias'
import Perfil from './pages/Perfil'
import PanelAdmin from './pages/PanelAdmin'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import ProtectedRoutes from './components/ProtectedRoutes'

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/deposit"
            element={<Deposit />}
          />

          <Route
            path="/transferencias"
            element={<Transferencias />}
          />

          <Route
            path="/perfil"
            element={<Perfil />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoutes roles={['Admin']}>
                <PanelAdmin />
              </ProtectedRoutes>
            }
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  )
}

export default App
