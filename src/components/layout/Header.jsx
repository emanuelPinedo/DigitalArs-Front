import { useLocation } from "react-router-dom";

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
    "/admin": {
        title: "Admin",
        subtitle: "Monitoreo operativo y gestión de usuarios",
    },
};

function Header() {
    const { pathname } = useLocation();
    const page = PAGE_HEADERS[pathname];

    if (!page) {
        return null;
    }

    return (
        <header className="app-header">
            <h1>{page.title}</h1>
            <p>{page.subtitle}</p>
        </header>
    );
}

export default Header;
