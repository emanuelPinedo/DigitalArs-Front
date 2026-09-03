import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
//acá irían los imports de los componentes/pages que se van a usar en las rutas, por ejemplo:
// import Home from './components/Home'
// import Login from './components/Login'
import ProtectedRoutes from './components/ProtectedRoutes'

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoutes roles={['admin']}>
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
