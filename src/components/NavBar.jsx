import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo / nombre */}
                <Link to="/dashboard" className="navbar-logo"> {/*no hay logo */}
                    DigitalArs
                </Link>

                {/* Opciones de navegación */}
                <div className="navbar-links">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/deposit">
                        Depósito
                    </Link>

                    <Link to="/transferencias">
                        Transferencias
                    </Link>

                    <Link to="/perfil">
                        Perfil
                    </Link>

                    {/* Solo Admin */}
                    {user?.role === "Admin" && (
                        <Link to="/admin">
                            Panel Admin
                        </Link>
                    )}

                </div>

                {/* Usuario + Logout */}
                <div className="navbar-user">

                    <span>
                        {user?.email}
                    </span>

                    <button onClick={handleLogout}>
                        Cerrar sesión
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;