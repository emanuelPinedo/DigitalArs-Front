import { createContext, useState } from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext();

const decodeToken = (token) => {
    const payload = token.split(".")[1];

    const decodedPayload = atob(
        payload.replace(/-/g, "+").replace(/_/g, "/")
    );

    return JSON.parse(decodedPayload);

}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser || storedUser === "undefined") {
            return null;
        }
        
        try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const login = async (email, password) => {
        const data = await AuthService.login(email, password);

        const decodedToken = decodeToken(data.token);

        const userData = {
            id: decodedToken.userId,
            email: decodedToken.email,
            role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(data.token);
        setUser(userData);

        return {
            ...data,
            user: userData,
        };
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
        value={{
            token,
            user,
            isAuthenticated,
            login,
            logout,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;