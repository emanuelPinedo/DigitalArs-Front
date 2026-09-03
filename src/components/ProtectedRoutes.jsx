const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token')

  const role = localStorage.getItem('role')
  if (role === 'admin') {
    return children
  } else if (role === 'user') {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

export default ProtectedRoutes