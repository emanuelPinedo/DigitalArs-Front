import '../../styles/components/admin/usertable.scss';

function UserTable({
    users,
    loading,
    onEdit,
    onDelete,
}) {
    const formatBalance = (balance) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(balance);
    };

    if (loading) {
        return (
            <div className="users-table-container">
                <div className="users-table__message">
                    Cargando usuarios...
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="users-table-container">
                <div className="users-table__message">
                    No se encontraron usuarios.
                </div>
            </div>
        );
    }

    return (
        <div className="users-table-container">
            <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Alias</th>
                            <th>Saldo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    {user.fullName}
                                    <br />
                                    <span className="users-table__email">
                                        {user.email}
                                    </span>
                                </td>
                                <td>
                                    {user.alias}
                                </td>
                                <td className="users-table__balance">
                                    {formatBalance(user.balance)}
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
                                            onClick={() => onEdit(user)}
                                        >
                                            Editar
                                        </button>
                                        {user.isActive && (
                                            <button
                                                className="delete-button"
                                                onClick={() => onDelete(user)}
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
        </div>
    );
}

export default UserTable;