import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import useAuth from "../hooks/useAuth";
import ProfileForm from "../components/ProfileForm";
import Card from "../components/Card";
import "../styles/pages/perfil.scss";

function Perfil() {
    const { user, updateUser } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        dni: '',
        alias: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const wantsPasswordChange =
            formData.currentPassword.trim() !== "" ||
            formData.newPassword.trim() !== "" ||
            formData.confirmPassword.trim() !== "";

        if (wantsPasswordChange) {
            if (
                !formData.currentPassword.trim() ||
                !formData.newPassword.trim() ||
                !formData.confirmPassword.trim()
            ) {
                setError("Para cambiar la contraseña tenés que completar los tres campos.");
                return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setError("La nueva contraseña y su confirmación no coinciden.");
                return;
            }
        };

        try {
            const dataToUpdate = {
                fullName: formData.fullName,
                email: formData.email,
                dni: formData.dni,
                alias: formData.alias,
                currentPassword: wantsPasswordChange
                    ? formData.currentPassword
                    : null,
                newPassword: wantsPasswordChange
                    ? formData.newPassword
                    : null,
            };

            await UserService.updateMe(dataToUpdate);

            const updatedUser = await UserService.getMe();

            updateUser({
                ...user,
                ...updatedUser,
            });

            setSuccess("Tus datos se actualizaron correctamente.");

            setFormData((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));
        } catch (error) {
            console.error(error);
            setError("No pudimos actualizar tus datos.");
        }
    };

    useEffect(() => {
        const loadPerfil = async () => {
            try {
                setLoading(true);
                setError("");

                const userData = await UserService.getMe();

                setFormData({
                    fullName: userData.fullName ?? "",
                    email: userData.email ?? "",
                    dni: userData.dni ?? "",
                    alias: userData.alias ?? "",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } catch (error) {
                console.error(error);
                setError("No pudimos cargar tu perfil.");
            } finally {
                setLoading(false);
            }
        };

        loadPerfil();
    }, []);

    if (loading) {
        return <p className="profile-loading">Cargando perfil...</p>
    }

    return (
        <main className='profile-page'>

            {error && <p className="profile-message profile-message-error">{error}</p>}
            {success && <p className="profile-message profile-message-success">{success}</p>}

            <Card className="dashboard-activity-card">
                {user.length === 0 ? (
                    <p className="dashboard-empty">
                        No hay datos de usuario.
                    </p>
                ) : (
                    <ul className="dashboard-activity-list">
                        
                        <p>{user.fullName}</p>
                                             
                        <p>{user.email}</p>
                        
                    </ul>
                )
                }
            </Card>

            <Card titleName="Datos Personales" className="dashboard-activity-card">
                
                <ProfileForm
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                />

            </Card>

        </main>
    );
}

export default Perfil;