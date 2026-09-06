import { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import '../styles/pages/paneladmin.scss';

function PanelAdmin() {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Paginación
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Filtros
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [isActive, setIsActive] = useState('');

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    // Usuario seleccionado para editar/eliminar
    const [selectedUser, setSelectedUser] = useState(null);

    // Formulario
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        dni: '',
        alias: '',
        roleId: 1,
        isActive: true,
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await UserService.getAll({
                page,
                pageSize,
                name,
                email,
                roleId,
                isActive,
            });

            setUsers(data.items);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalItems);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page]);

    const handleSearch = (event) => {
        event.preventDefault();

        setPage(1);
        loadUsers();
    };

    const handleClearFilters = () => {
        setName('');
        setEmail('');
        setRoleId('');
        setIsActive('');
        setPage(1);

        // Cargamos directamente sin filtros
        loadUsersWithoutFilters();
    };

    const loadUsersWithoutFilters = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await UserService.getAll({
                page: 1,
                pageSize,
            });

            setUsers(data.items);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalItems);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setSelectedUser(null);

        setFormData({
            fullName: '',
            email: '',
            password: '',
            dni: '',
            alias: '',
            roleId: 1,
            isActive: true,
        });

        setModalType('create');
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);

        setFormData({
            fullName: user.fullName,
            email: user.email,
            password: '',
            dni: user.dni,
            alias: user.alias,
            roleId: user.roleId,
            isActive: user.isActive,
        });

        setModalType('edit');
        setModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setModalType('delete');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType('');
        setSelectedUser(null);
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        try {
            setError('');

            await UserService.create({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                dni: formData.dni,
                alias: formData.alias,
                roleId: Number(formData.roleId),
            });

            closeModal();

            // Refrescar tabla
            await loadUsers();
        } catch (err) {
            console.error(err);

            if (err.response?.status === 409) {
                setError('Ya existe un usuario con ese email.');
            } else {
                setError('No se pudo crear el usuario.');
            }
        }
    };

    const handleEdit = async (event) => {
        event.preventDefault();

        try {
            setError('');

            await UserService.update(selectedUser.id, {
                fullName: formData.fullName,
                email: formData.email,
                dni: formData.dni,
                alias: formData.alias,
                roleId: Number(formData.roleId),
                isActive: formData.isActive,
            });

            closeModal();

            // Refrescar tabla
            await loadUsers();
        } catch (err) {
            console.error(err);

            if (err.response?.status === 409) {
                setError('Ya existe un usuario con ese email.');
            } else {
                setError('No se pudo actualizar el usuario.');
            }
        }
    };

    const handleDelete = async () => {
        try {
            setError('');

            await UserService.remove(selectedUser.id);

            closeModal();

            // Refrescar tabla
            await loadUsers();
        } catch (err) {
            console.error(err);
            setError('No se pudo eliminar el usuario.');
        }
    };

    return (
        <main className="panel-admin">

            <header className="panel-admin__header">
                <div>
                    <h1>Gestión de usuarios</h1>
                    <p>
                        Crear, editar, consultar y administrar usuarios de DigitalArs.
                    </p>
                </div>

                <button
                    className="panel-admin__create-button"
                    onClick={openCreateModal}
                >
                    + Crear usuario
                </button>
            </header>


            {/* Filtros */}
            <section className="users-filters">

                <form onSubmit={handleSearch}>

                    <div className="users-filters__fields">

                        <div className="form-field">
                            <label htmlFor="name">
                                Nombre
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Buscar por nombre"
                            />
                        </div>


                        <div className="form-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Buscar por email"
                            />
                        </div>


                        <div className="form-field">
                            <label htmlFor="roleId">
                                Rol
                            </label>

                            <input
                                id="roleId"
                                type="number"
                                min="1"
                                value={roleId}
                                onChange={(event) => setRoleId(event.target.value)}
                                placeholder="ID del rol"
                            />
                        </div>


                        <div className="form-field">
                            <label htmlFor="isActive">
                                Estado
                            </label>

                            <select
                                id="isActive"
                                value={isActive}
                                onChange={(event) => setIsActive(event.target.value)}
                            >
                                <option value="">
                                    Todos
                                </option>

                                <option value="true">
                                    Activos
                                </option>

                                <option value="false">
                                    Inactivos
                                </option>
                            </select>
                        </div>

                    </div>


                    <div className="users-filters__actions">

                        <button type="submit">
                            Buscar
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleClearFilters}
                        >
                            Limpiar
                        </button>

                    </div>

                </form>

            </section>


            {/* Mensaje de error */}
            {error && (
                <div className="panel-admin__error">
                    {error}
                </div>
            )}


            {/* Tabla */}
            <section className="users-table-container">

                <div className="users-table-header">
                    <div>
                        <h2>Usuarios</h2>
                        <span>
                            {totalItems} usuario(s)
                        </span>
                    </div>
                </div>


                {loading ? (
                    <div className="users-table__message">
                        Cargando usuarios...
                    </div>
                ) : users.length === 0 ? (
                    <div className="users-table__message">
                        No se encontraron usuarios.
                    </div>
                ) : (
                    <div className="table-wrapper">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>DNI</th>
                                    <th>Alias</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((user) => (
                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>

                                        <td>
                                            {user.fullName}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.dni}
                                        </td>

                                        <td>
                                            {user.alias}
                                        </td>

                                        <td>
                                            Rol {user.roleId}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    user.isActive
                                                        ? 'status status--active'
                                                        : 'status status--inactive'
                                                }
                                            >
                                                {user.isActive
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </td>

                                        <td>

                                            <div className="table-actions">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(user)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                {user.isActive && (
                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            openDeleteModal(user)
                                                        }
                                                    >
                                                        Dar de baja
                                                    </button>
                                                )}

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}


                {/* Paginación */}
                {totalPages > 0 && (
                    <div className="pagination">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage((previous) => previous - 1)}
                        >
                            Anterior
                        </button>

                        <span>
                            Página {page} de {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((previous) => previous + 1)}
                        >
                            Siguiente
                        </button>

                    </div>
                )}

            </section>


            {/* MODAL CREAR */}
            {modalOpen && modalType === 'create' && (
                <div className="modal-backdrop">

                    <div className="modal">

                        <div className="modal__header">
                            <h2>Crear usuario</h2>

                            <button onClick={closeModal}>
                                ×
                            </button>
                        </div>


                        <form onSubmit={handleCreate}>

                            <div className="modal__body">

                                <div className="form-field">
                                    <label>Nombre completo</label>

                                    <input
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>Email</label>

                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>Contraseña</label>

                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>DNI</label>

                                    <input
                                        name="dni"
                                        type="text"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>Alias</label>

                                    <input
                                        name="alias"
                                        type="text"
                                        value={formData.alias}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>Rol ID</label>

                                    <input
                                        name="roleId"
                                        type="number"
                                        min="1"
                                        value={formData.roleId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>


                            <div className="modal__actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>

                                <button type="submit">
                                    Crear usuario
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* MODAL EDITAR */}
            {modalOpen && modalType === 'edit' && (
                <div className="modal-backdrop">

                    <div className="modal">

                        <div className="modal__header">

                            <h2>Editar usuario</h2>

                            <button onClick={closeModal}>
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleEdit}>

                            <div className="modal__body">

                                <div className="form-field">
                                    <label>Nombre completo</label>

                                    <input
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>Email</label>

                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>DNI</label>

                                    <input
                                        name="dni"
                                        type="text"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>Alias</label>

                                    <input
                                        name="alias"
                                        type="text"
                                        value={formData.alias}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <div className="form-field">
                                    <label>Rol ID</label>

                                    <input
                                        name="roleId"
                                        type="number"
                                        min="1"
                                        value={formData.roleId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>


                                <label className="checkbox-field">

                                    <input
                                        name="isActive"
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />

                                    Usuario activo

                                </label>

                            </div>


                            <div className="modal__actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>

                                <button type="submit">
                                    Guardar cambios
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* MODAL ELIMINAR */}
            {modalOpen && modalType === 'delete' && (
                <div className="modal-backdrop">

                    <div className="modal modal--small">

                        <div className="modal__header">

                            <h2>Dar de baja usuario</h2>

                            <button onClick={closeModal}>
                                ×
                            </button>

                        </div>


                        <div className="modal__body">

                            <p>
                                ¿Estás seguro de que querés dar de baja a
                                <strong> {selectedUser?.fullName}</strong>?
                            </p>

                            <p className="modal__warning">
                                El usuario no será eliminado físicamente.
                                Se marcará como inactivo.
                            </p>

                        </div>


                        <div className="modal__actions">

                            <button
                                className="secondary-button"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>

                            <button
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                Dar de baja
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </main>
    );
}

export default PanelAdmin;