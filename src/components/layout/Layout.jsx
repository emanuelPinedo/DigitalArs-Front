import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Header from "./Header";

function Layout() {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="app-main">
                <Header />
                <div className="app-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
