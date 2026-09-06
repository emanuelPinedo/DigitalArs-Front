import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Deposit from './pages/Deposit'
import Transferencias from './pages/Transferencias'
import PlazoFijo from './pages/PlazoFijo'
import Perfil from './pages/Perfil'
import Historial from './pages/Historial'
import PanelAdmin from './pages/PanelAdmin'
import NotFound from './pages/NotFound'
import Layout from './components/layout/Layout'
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
            path="/plazo-fijo"
            element={<PlazoFijo />}
          />

          <Route
            path="/perfil"
            element={<Perfil />}
          />
          <Route
            path="/historial"
            element={<Historial />}
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
