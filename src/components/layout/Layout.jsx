import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./NavBar";
import Header from "./Header";
import PixelBlast from "../PixelBlast";
import useTheme from "../../hooks/useTheme";

function Layout() {
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleMenu = () => { setIsSidebarOpen((prev) => !prev); };
    const closeMenu = () => { setIsSidebarOpen(false); };

    return (
        <div className="app-layout">
            <Navbar isOpen={isSidebarOpen} onClose={closeMenu} />

            {isSidebarOpen && (
                <div className="navbar-overlay" onClick={closeMenu} aria-hidden="true" />
            )}

            <div className="app-main">
                <div className="app-background" aria-hidden="true">
                    <PixelBlast
                        color={theme === "dark" ? "#222222" : "#FFFFFF"}
                    />
                </div>
                <Header theme={theme} toggleTheme={toggleTheme} onMenuToggle={toggleMenu} />
                <div className="app-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
