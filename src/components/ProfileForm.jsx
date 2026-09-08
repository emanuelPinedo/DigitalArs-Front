function ProfileForm({ formData, setFormData, handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fullName">Nombre completo</label>
                <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            fullName: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            email: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label htmlFor="dni">DNI</label>
                <input
                    id="dni"
                    type="text"
                    value={formData.dni}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            dni: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label htmlFor="alias">Alias</label>
                <input
                    id="alias"
                    type="text"
                    value={formData.alias}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            alias: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label htmlFor="currentPassword">Contraseña actual</label>
                <input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            currentPassword: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            newPassword: e.target.value,
                        })
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
                        setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                        })
                    }
                />
            </div>

            <div className="profile-form-actions">
                <button type="submit">
                    Guardar cambios
                </button>
            </div>
        </form>
    );
}

export default ProfileForm;