import React, { useState, useEffect } from 'react';

import UserFilters from '../components/admin/UserFilters';
import UserTable from '../components/admin/UserTable';
import UserPagination from '../components/admin/UserPagination';
import UserModal from '../components/admin/UserModal';

import AccountService from '../services/AccountService';
import UserService from '../services/UserService';

import '../styles/pages/paneladmin.scss';

function PanelAdmin() {

    // =========================
    // USUARIOS
    // =========================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // =========================
    // PAGINACIÓN
    // =========================

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // =========================
    // FILTROS
    // =========================

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [alias, setAlias] = useState('');
    const [isActive, setIsActive] = useState('');

    // =========================
    // MODAL
    // =========================

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        dni: '',
        alias: '',
        roleId: '',
        isActive: true
    });

    // =========================
    // CARGAR USUARIOS
    // =========================

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError('');

            const usersResponse = await UserService.getAll({
                page,
                pageSize,
                name,
                email,
                alias,
                isActive
            });

            const accounts = await AccountService.getAll();

            const usersWithBalance = usersResponse.items.map(user => {

                const account = accounts.find(
                    account => account.userId === user.id
                );

                return {
                    ...user,
                    balance: account?.price ?? 0
                };
            });

            setUsers(usersWithBalance);

            setTotalPages(usersResponse.totalPages);
            setTotalItems(usersResponse.totalItems);

        } catch (err) {

            console.error(err);

            setError(
                'No se pudieron cargar los usuarios.'
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page]);

    // =========================
    // FILTROS
    // =========================

    const handleSearch = (event) => {

        event.preventDefault();

        if (page !== 1) {
            setPage(1);
            return;
        }

        loadUsers();
    };

    const handleClearFilters = () => {

        setName('');
        setEmail('');
        setAlias('');
        setIsActive('');

        setPage(1);
    };

    // =========================
    // MODAL
    // =========================

    const openCreateModal = () => {

        setSelectedUser(null);

        setFormData({
            fullName: '',
            email: '',
            password: '',
            dni: '',
            alias: '',
            roleId: '',
            isActive: true
        });

        setModalType('create');
        setModalOpen(true);
    };

    const openEditModal = (user) => {

        setSelectedUser(user);

        setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            password: '',
            dni: user.dni || '',
            alias: user.alias || '',
            roleId: user.roleId || '',
            isActive: user.isActive ?? true
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
        setSelectedUser(null);
        setModalType('');
    };

    // =========================
    // CREAR USUARIO
    // =========================

    const handleCreate = async () => {

        try {

            setError('');

            await UserService.create(formData);

            closeModal();

            await loadUsers();

        } catch (err) {

            console.error(err);

            setError(
                'No se pudo crear el usuario.'
            );
        }
    };

    // =========================
    // EDITAR USUARIO
    // =========================

    const handleEdit = async () => {

        try {

            setError('');

            await UserService.update(
                selectedUser.id,
                formData
            );

            closeModal();

            await loadUsers();

        } catch (err) {

            console.error(err);

            setError(
                'No se pudo actualizar el usuario.'
            );
        }
    };

    // =========================
    // ELIMINAR USUARIO
    // =========================

    const handleDelete = async () => {

        try {

            setError('');

            await UserService.delete(
                selectedUser.id
            );

            closeModal();

            await loadUsers();

        } catch (err) {

            console.error(err);

            setError(
                'No se pudo eliminar el usuario.'
            );
        }
    };

    // =========================
    // RENDER
    // =========================

    return (
        <main className="panel-admin">

            <header className="panel-admin__header">

                <div>
                    <h1>Gestión de usuarios</h1>

                    <p>
                        Crear, editar, consultar y administrar usuarios
                        de DigitalArs.
                    </p>
                </div>

                <button
                    type="button"
                    className="panel-admin__create-button"
                    onClick={openCreateModal}
                >
                    + Crear usuario
                </button>

            </header>

            <UserFilters
                name={name}
                setName={setName}

                email={email}
                setEmail={setEmail}

                alias={alias}
                setAlias={setAlias}

                isActive={isActive}
                setIsActive={setIsActive}

                onSearch={handleSearch}
                onClear={handleClearFilters}
            />

            {error && (
                <div className="panel-admin__error">
                    {error}
                </div>
            )}

            <UserTable
                users={users}
                loading={loading}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
            />

            <UserPagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />

            <UserModal
                open={modalOpen}
                type={modalType}
                user={selectedUser}
                formData={formData}
                setFormData={setFormData}
                onClose={closeModal}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </main>
    );
}

export default PanelAdmin;