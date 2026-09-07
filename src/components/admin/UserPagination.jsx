import '../../styles/components/admin/userpagination.scss';

function UserPagination({
    page,
    totalPages,
    setPage,
}) {
    if (totalPages <= 0) {
        return null;
    }

    return (
        <div className="pagination">

            <button
                disabled={page === 1}
                onClick={() =>
                    setPage((previous) => previous - 1)
                }
            >
                Anterior
            </button>

            <span>
                Página {page} de {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() =>
                    setPage((previous) => previous + 1)
                }
            >
                Siguiente
            </button>

        </div>
    );
}

export default UserPagination;