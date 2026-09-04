import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
//acá irían los imports de los componentes/pages que se van a usar en las rutas, por ejemplo:
// import Home from './components/Home'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PanelAdmin from './pages/PanelAdmin';
import ProtectedRoutes from './components/ProtectedRoutes'

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoutes roles={['admin']}>
                <h1>Protected Content</h1>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes roles={['user']}>
                <h1>Protected Content</h1>
              </ProtectedRoutes>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
