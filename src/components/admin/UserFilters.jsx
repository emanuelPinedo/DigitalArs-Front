import '../../styles/components/admin/userfilters.scss';

function UserFilters({
    name,
    setName,
    email,
    setEmail,
    alias,
    setAlias,
    isActive,
    setIsActive,
    onSearch,
    onClear,
}) {
    return (
        <section className="users-filters">

            <form onSubmit={onSearch}>

                <div className="users-filters__fields">

                    <div className="form-field">
                        <label htmlFor="name">
                            Nombre
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Buscar por nombre"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-field">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Buscar por email"
                        />
                    </div>

                    {/* Alias */}
                    <div className="form-field">
                        <label htmlFor="alias">
                            Alias
                        </label>

                        <input
                            id="alias"
                            type="text"
                            value={alias}
                            onChange={(event) =>
                                setAlias(event.target.value)
                            }
                            placeholder="Buscar por alias"
                        />
                    </div>

                    {/* Estado */}
                    <div className="form-field">
                        <label htmlFor="isActive">
                            Estado
                        </label>

                        <select
                            id="isActive"
                            value={isActive}
                            onChange={(event) =>
                                setIsActive(event.target.value)
                            }
                        >
                            <option value="">
                                Todos
                            </option>
                            <option value="true">
                                Activo
                            </option>
                            <option value="false">
                                Inactivo
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
                        onClick={onClear}
                    >
                        Limpiar
                    </button>
                </div>

            </form>

        </section>
    );
}

export default UserFilters;