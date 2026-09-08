import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import ProfileForm from "../components/ProfileForm";
import Card from "../components/Card";
import "../styles/pages/perfil.scss";

function Perfil() {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();

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

    const handleSubmit = async (event) => {
        event.preventDefault();

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
                toast.error("Para cambiar la contraseña tenés que completar los tres campos.");
                return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("La nueva contraseña y su confirmación no coinciden.");
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

            toast.success("Tus datos se actualizaron correctamente.");

            setFormData((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));
        } catch (error) {
            console.error(error);
            toast.error("No pudimos actualizar tus datos.");
        }
    };

    useEffect(() => {
        const loadPerfil = async () => {
            try {
                setLoading(true);

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
                toast.error("No pudimos cargar tu perfil.");
            } finally {
                setLoading(false);
            }
        };

        loadPerfil();
    }, [toast]);

    if (loading) {
        return <p className="profile-loading">Cargando perfil...</p>
    }

    const initials = user?.fullName
        ? user.fullName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0].toUpperCase())
              .join("")
        : "?";

    return (
        <main className='profile-page'>

            <Card className="profile-summary-card" title={false}>
                {!user ? (
                    <p className="dashboard-empty">
                        No hay datos de usuario.
                    </p>
                ) : (
                    <div className="profile-summary">
                        <span className="profile-summary__avatar">
                            {initials}
                        </span>

                        <div className="profile-summary__info">
                            <p className="profile-summary__name">
                                {user.fullName}
                            </p>
                            <p className="profile-summary__email">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            <Card titleName="Datos personales" className="profile-form-card">
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