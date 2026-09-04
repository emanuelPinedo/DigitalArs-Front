//import "../../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};
        setServerError("");

        if (!email.trim() || !email.includes("@")) {
            newErrors.email = "Ingresa un email valido"
        }

        if (!password.trim()) {
            newErrors.password = "La contraseña es obligatoria";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);

            const data = await login(email, password);

            const role = data.user?.role;

            if (role === "Admin") {
                navigate("/admin");
            } else if (role === "User") {
                navigate("/dashboard");
            } else {
                setServerError("El usuario no tiene un rol válido.");
            }
        } catch (error) {
            const message = error.response?.data?.message ||
                "No se pudo iniciar sesión. Verifica tu email y contraseña.";
           
            setServerError(message);
        } finally {
            setLoading(false);
        }

    };
    
    const handleEmailChange = (event) => { 
        setEmail(event.target.value); 
        
        setErrors((prev) => ({
            ...prev, 
            email: "", 
        }));
        
        setServerError(""); 
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        
        setErrors((prev) => ({
            ...prev,
            password: "",
        }));
        
        setServerError(""); 
    };


return (
    <form className='login-form' onSubmit={handleSubmit}>
        <h1 className="login-title">Iniciar sesión</h1>

        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="Ingrese email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
            />
            {errors.email && (
                <span className="input-error">
                    {errors.email}
                </span>
            )}
        </div>

        <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                />
                <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={
                       showPassword 
                       ? "Ocultar contraseña" 
                       : "Mostrar contraseña" 
                    }
                >
                    {showPassword ? "◉" : "👁"}
                </button>

            </div>

            {errors.password && (
                <span className="input-error">
                    {errors.password}
                </span>
            )}

        </div>

        {serverError && (
            <div className="login-error">
                {serverError}
            </div>
        )}

        <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <a href="#">Recuperar usuario o clave</a>
        <a href="#">Registrarse</a>
    </form>
);
}

export default LoginForm;