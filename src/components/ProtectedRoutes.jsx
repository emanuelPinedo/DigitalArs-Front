import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoutes = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth()

  //si no esta logueado lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  //si la ruta requiere un rol y el usuario no lo tiene
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  //user autorizado
  return children
}

export default ProtectedRoutes