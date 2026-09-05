import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-logo">
                DigitalArs
            </Link>

            <div className="navbar-links">
                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/deposit">
                    Depósito
                </NavLink>

                <NavLink to="/transferencias">
                    Transferencia
                </NavLink>

                <NavLink to="/perfil">
                    Perfil
                </NavLink>

                <NavLink to="/historial">
                    Historial
                </NavLink>

                {user?.role === "Admin" && (
                    <NavLink to="/admin">
                        Admin
                    </NavLink>
                )}
            </div>

            <div className="navbar-user">
                <span>{user?.email}</span>
                <button type="button" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
