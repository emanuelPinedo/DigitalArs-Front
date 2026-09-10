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

                        <div>
                            <label htmlFor="currentPassword">
                                Contraseña actual
                            </label>

                            <input
                                id="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) =>
                                    handleChange(
                                        "currentPassword",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword">
                                Nueva contraseña
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) =>
                                    handleChange(
                                        "newPassword",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword">
                                Confirmar nueva contraseña
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    handleChange(
                                        "confirmPassword",
                                        e.target.value
                                    )
                                }
                            />
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
