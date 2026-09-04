import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Deposit from './pages/Deposit'
import Transferencias from './pages/Transferencias'
import Perfil from './pages/Perfil'
import PanelAdmin from './pages/PanelAdmin'
import NotFound from './pages/NotFound'
import Navbar from './components/NavBar'
import ProtectedRoutes from './components/ProtectedRoutes'
import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>

      {/* Navbar solamente cuando el usuario está logueado */}
      {isAuthenticated && <Navbar />}

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace  />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/deposit"
          element={
            <ProtectedRoutes>
              <Deposit />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/transferencias"
          element={
            <ProtectedRoutes>
              <Transferencias />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoutes>
              <Perfil />
            </ProtectedRoutes>
          }
        />


        {/* Ruta solamente para Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoutes roles={['Admin']}>
              <PanelAdmin />
            </ProtectedRoutes>
          }
        />

        {/* Ruta para cualquier otro caso (404) */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </Router>
  )
}

export default App