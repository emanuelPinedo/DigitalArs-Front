import { createPortal } from 'react-dom';
import '../../styles/components/admin/usermodal.scss';

function UserModal({
    open,
    type,
    user,
    formData,
    setFormData,
    onClose,
    onCreate,
    onEdit,
    onDelete,
}) {
    if (!open) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    let modalContent = null;

    if (type === 'create') {
        modalContent = (
            <div className="modal-backdrop">
                <div className="modal">
                    <div className="modal__header">
                        <h2>Crear usuario</h2>
                        <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
                    </div>
                    <form onSubmit={onCreate}>
                        <div className="modal__body">
                            <div className="form-field">
                                <label htmlFor="create-fullName">Nombre completo</label>
                                <input id="create-fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="create-email">Email</label>
                                <input id="create-email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="create-password">Contraseña</label>
                                <input id="create-password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="create-dni">DNI</label>
                                <input id="create-dni" name="dni" type="text" value={formData.dni} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="create-alias">Alias</label>
                                <input id="create-alias" name="alias" type="text" value={formData.alias} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="create-roleId">Rol ID</label>
                                <input id="create-roleId" name="roleId" type="number" min="1" value={formData.roleId} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="modal__actions">
                            <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
                            <button type="submit">Crear usuario</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (type === 'edit') {
        modalContent = (
            <div className="modal-backdrop">
                <div className="modal">
                    <div className="modal__header">
                        <h2>Editar usuario</h2>
                        <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
                    </div>
                    <form onSubmit={onEdit}>
                        <div className="modal__body">
                            <div className="form-field">
                                <label htmlFor="edit-fullName">Nombre completo</label>
                                <input id="edit-fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="edit-email">Email</label>
                                <input id="edit-email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="edit-dni">DNI</label>
                                <input id="edit-dni" name="dni" type="text" value={formData.dni} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="edit-alias">Alias</label>
                                <input id="edit-alias" name="alias" type="text" value={formData.alias} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="edit-roleId">Rol ID</label>
                                <input id="edit-roleId" name="roleId" type="number" min="1" value={formData.roleId} onChange={handleChange} required />
                            </div>
                            <label className="checkbox-field" htmlFor="edit-isActive">
                                <input id="edit-isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
                                Usuario activo
                            </label>
                        </div>
                        <div className="modal__actions">
                            <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
                            <button type="submit">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (type === 'delete') {
        modalContent = (
            <div className="modal-backdrop">
                <div className="modal modal--small">
                    <div className="modal__header">
                        <h2>Dar de baja usuario</h2>
                        <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
                    </div>
                    <div className="modal__body">
                        <p>¿Estás seguro de que querés dar de baja a <strong>{user?.fullName}</strong>?</p>
                        <p className="modal__warning">El usuario no será eliminado físicamente. Se marcará como inactivo.</p>
                    </div>
                    <div className="modal__actions">
                        <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
                        <button type="button" className="delete-button" onClick={onDelete}>Dar de baja</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!modalContent) {
        return null;
    }

    return createPortal(modalContent, document.body);
}

export default UserModal;