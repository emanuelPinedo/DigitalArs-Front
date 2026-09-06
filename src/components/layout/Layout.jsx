import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Header from "./Header";
import PixelBlast from "../PixelBlast";
import useTheme from "../../hooks/useTheme";

function Layout() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="app-layout">
            <Navbar />
            <div className="app-main">
                <div className="app-background" aria-hidden="true">
                    <PixelBlast
                        color={theme === "dark" ? "#222222" : "#FFFFFF"}
                    />
                </div>
                <Header theme={theme} toggleTheme={toggleTheme} />
                <div className="app-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
