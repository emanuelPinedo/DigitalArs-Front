import { useLocation } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import "../../styles/layout/header.scss";

const PAGE_HEADERS = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Una vista simple de tus finanzas",
    },
    "/deposit": {
        title: "Depósito",
        subtitle: "Ingresá dinero a tu cuenta DigitalArs",
    },
    "/transferencias": {
        title: "Transferencia",
        subtitle: "Enviá pesos de forma inmediata y segura",
    },
    "/perfil": {
        title: "Perfil",
        subtitle: "Administrá tus datos y la seguridad de tu cuenta",
    },
    "/historial": {
        title: "Historial",
        subtitle: "Consultá todos tus movimientos",
    },
    "/admin": {
        title: "Admin",
        subtitle: "Monitoreo operativo y gestión de usuarios",
    },
};

function SunIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    );
}

function Header() {
    const { pathname } = useLocation();
    const { theme, toggleTheme } = useTheme();
    const page = PAGE_HEADERS[pathname];
    const isDark = theme === "dark";

    if (!page) {
        return null;
    }

    return (
        <header className="app-header">
            <div className="app-header-copy">
                <h2>{page.title}</h2>
                <p>{page.subtitle}</p>
            </div>

            <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={
                    isDark
                        ? "Cambiar a tema claro"
                        : "Cambiar a tema oscuro"
                }
            >
                {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
        </header>
    );
}

export default Header;
