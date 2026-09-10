import eyeIcon from "../assets/images/icons/eye.svg";
import eyeOffIcon from "../assets/images/icons/eye-off.svg";
import { useState } from "react";

function ProfileForm({
    formData,
    setFormData,
    handleSubmit,
    isEditing,
    setIsEditing,
    isChangingPassword,
    setIsChangingPassword,
    onCancelEdit,
}) {

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleCancelPassword = () => {
        setIsChangingPassword(false);

        setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }));
    };

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label htmlFor="fullName">Nombre completo</label>
                <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    disabled={!isEditing}
                    onChange={(e) =>
                        handleChange("fullName", e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                        handleChange("email", e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="dni">DNI</label>
                <input
                    id="dni"
                    type="text"
                    value={formData.dni}
                    disabled={!isEditing}
                    onChange={(e) =>
                        handleChange("dni", e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="alias">Alias</label>
                <input
                    id="alias"
                    type="text"
                    value={formData.alias}
                    disabled={!isEditing}
                    onChange={(e) =>
                        handleChange("alias", e.target.value)
                    }
                />
            </div>

            {!isEditing && (
                <div className="profile-form-actions">
                    <button
                        type="button"
                        className="profile-button profile-button--secondary"
                        onClick={() => setIsEditing(true)}
                    >
                        Editar datos
                    </button>
                </div>
            )}

            {isEditing && (
                <div className="profile-form-actions profile-form-actions--editing">
                    <button
                        type="button"
                        className="profile-button profile-button--cancel"
                        onClick={onCancelEdit}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="profile-button profile-button--primary"
                    >
                        Guardar cambios
                    </button>
                </div>
            )}

            <div className="profile-password-section">

                <div className="profile-password-header">
                    <div>
                        <label>Contraseña</label>
                        {!isChangingPassword && (
                            <p>
                                Tu contraseña está protegida
                            </p>
                        )}
                    </div>

                    {!isChangingPassword && (
                        <button
                            type="button"
                            className="profile-password-button"
                            onClick={() => setIsChangingPassword(true)}
                        >
                            Cambiar contraseña
                        </button>
                    )}
                </div>

                {isChangingPassword && (
                    <div className="profile-password-fields">

                        <div className="password-input">
                            <label htmlFor="currentPassword">
                                Contraseña actual
                            </label>

                            <input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) =>
                                    handleChange(
                                        "currentPassword",
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <img
                                    className="toggle-password-icon"
                                    src={showCurrentPassword ? eyeOffIcon : eyeIcon}
                                    alt=""
                                />
                            </button>
                        </div>

                        <div className="password-input">
                            <label htmlFor="newPassword">
                                Nueva contraseña
                            </label>

                            <input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) =>
                                    handleChange(
                                        "newPassword",
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <img
                                    className="toggle-password-icon"
                                    src={showNewPassword ? eyeOffIcon : eyeIcon}
                                    alt=""
                                />
                            </button>
                        </div>

                        <div className="password-input">
                            <label htmlFor="confirmPassword">
                                Confirmar nueva contraseña
                            </label>

                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    handleChange(
                                        "confirmPassword",
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <img
                                    className="toggle-password-icon"
                                    src={showConfirmPassword ? eyeOffIcon : eyeIcon}
                                    alt=""
                                />
                            </button>
                        </div>

                        <div className="profile-password-actions">
                            <button
                                type="button"
                                className="profile-button profile-button--cancel"
                                onClick={handleCancelPassword}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="profile-button profile-button--primary"
                            >
                                Guardar contraseña
                            </button>
                        </div>

                    </div>
                )}
            </div>

        </form>
    );
}

export default ProfileForm;
