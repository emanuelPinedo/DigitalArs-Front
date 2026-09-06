import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/layout/navbar.scss";

import dashboardIcon from "../../assets/images/icons/layout-dashboard.svg?raw";
import walletIcon from "../../assets/images/icons/wallet.svg?raw";
import sendIcon from "../../assets/images/icons/send.svg?raw";
import landmarkIcon from "../../assets/images/icons/landmark.svg?raw";
import userIcon from "../../assets/images/icons/user.svg?raw";
import historyIcon from "../../assets/images/icons/book-text.svg?raw";
import adminIcon from "../../assets/images/icons/user-star.svg?raw";
import logoutIcon from "../../assets/images/icons/log-out.svg?raw";
import logo from "../../assets/images/logo.svg";

function NavIcon({ svg }) {
    return (
        <span
            className="navbar-icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    console.log(user);
    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-logo">
               <img src={logo} alt="DigitalArs"/>
               <h1>Digital<span>Ars</span></h1>
            </Link>

            <div className="navbar-links">
                <NavLink to="/dashboard">
                    <NavIcon svg={dashboardIcon} />
                    Dashboard
                </NavLink>

                <NavLink to="/deposit">
                    <NavIcon svg={walletIcon} />
                    Depósito
                </NavLink>

                <NavLink to="/transferencias">
                    <NavIcon svg={sendIcon} />
                    Transferencia
                </NavLink>

                <NavLink to="/perfil">
                    <NavIcon svg={userIcon} />
                    Perfil
                </NavLink>

                <NavLink to="/historial">
                    <NavIcon svg={historyIcon} />
                    Historial
                </NavLink>
                
                <NavLink to="/plazo-fijo">
                    <NavIcon svg={landmarkIcon} />
                    Plazo fijo
                </NavLink>

                {user?.role === "Admin" && (
                    <NavLink to="/admin">
                        <NavIcon svg={adminIcon} />
                        Admin
                    </NavLink>
                )}
            </div>

            <div className="navbar-user">
                <div>
                    <p className="name">{user?.fullName || "Nombre completo"}</p>
                    <p className="email">{user?.email}</p>
                </div>
                <button type="button" onClick={handleLogout}>
                    <NavIcon svg={logoutIcon} />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
