import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
//acá irían los imports de los componentes/pages que se van a usar en las rutas, por ejemplo:
// import Home from './components/Home'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PanelAdmin from './pages/PanelAdmin';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotFound from './pages/NotFound';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas con roles*/}
          {/* Rutas USER*/}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes roles={['User']}>
                <Dashboard />
              </ProtectedRoutes>
            }
          />

          {/* Rutas ADMIN*/}
          <Route
            path="/admin"
            element={
              <ProtectedRoutes roles={['Admin']}>
                <PanelAdmin />
              </ProtectedRoutes>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
