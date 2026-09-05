import { useCallback, useEffect, useRef, useState } from 'react';
import TransactionService from '../services/TransactionService';
import { getApiErrorMessage } from '../utils/apiError';
import '../styles/pages/historial.scss';

const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;
const FALLBACK_ROW_HEIGHT = 53;

function getRowHeightFromCell(cell) {
    const styles = getComputedStyle(cell);
    const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const fontSize = parseFloat(styles.fontSize);
    const lineHeight = styles.lineHeight === 'normal'
        ? fontSize * 1.5
        : parseFloat(styles.lineHeight);
    const border = parseFloat(styles.borderBottomWidth) || 0;

    return padding + lineHeight + border;
}

function getFittedPageSize(wrap) {
    if (!wrap) {
        return MIN_PAGE_SIZE;
    }

    const header = wrap.querySelector('thead');
    const visibleRow = wrap.querySelector('tbody tr');
    const cell = wrap.querySelector('th, td');
    const headerHeight = header?.getBoundingClientRect().height || FALLBACK_ROW_HEIGHT;
    const rowHeight = visibleRow?.getBoundingClientRect().height
        || (cell ? getRowHeightFromCell(cell) : FALLBACK_ROW_HEIGHT);
    const available = wrap.clientHeight - headerHeight;

    return Math.min(
        MAX_PAGE_SIZE,
        Math.max(MIN_PAGE_SIZE, Math.floor(available / rowHeight))
    );
}

const EMPTY_FILTERS = {
    type: '',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
};

const TYPE_LABELS = {
    Deposit: 'Depósito',
    Transfer_In: 'Transferencia recibida',
    Transfer_Out: 'Transferencia enviada',
};

function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(value);
}

function formatDate(value) {
    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function isIncome(type) {
    return type === 'Deposit' || type === 'Transfer_In';
}

function hasActiveFilters(filters) {
    return Object.values(filters).some((value) => String(value).trim() !== '');
}

function parseAmount(value) {
    if (value === '' || value == null) {
        return null;
    }

    const parsed = Number(String(value).replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : NaN;
}

function Historial() {
    const [formFilters, setFormFilters] = useState(EMPTY_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
    const [filterError, setFilterError] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(null);
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const tableWrapRef = useRef(null);

    useEffect(() => {
        const wrap = tableWrapRef.current;

        if (!wrap) {
            return undefined;
        }

        const updatePageSize = () => {
            const nextSize = getFittedPageSize(wrap);

            setPageSize((currentSize) => {
                if (currentSize === nextSize) {
                    return currentSize;
                }

                setPage((currentPage) => {
                    const oldSize = currentSize ?? nextSize;
                    const firstIndex = (currentPage - 1) * oldSize;
                    return Math.floor(firstIndex / nextSize) + 1;
                });

                return nextSize;
            });
        };

        const observer = new ResizeObserver(updatePageSize);
        observer.observe(wrap);
        updatePageSize();

        return () => observer.disconnect();
    }, []);

    const loadHistory = useCallback(async () => {
        if (!pageSize) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            const data = await TransactionService.getMine({
                page,
                pageSize,
                type: appliedFilters.type || undefined,
                fromDate: appliedFilters.fromDate || undefined,
                toDate: appliedFilters.toDate || undefined,
                minAmount: appliedFilters.minAmount === ''
                    ? undefined
                    : Number(appliedFilters.minAmount),
                maxAmount: appliedFilters.maxAmount === ''
                    ? undefined
                    : Number(appliedFilters.maxAmount),
            });

            setItems(Array.isArray(data?.items) ? data.items : []);
            setTotalItems(data?.totalItems ?? 0);
            setTotalPages(data?.totalPages ?? 0);
        } catch (loadError) {
            setItems([]);
            setTotalItems(0);
            setTotalPages(0);
            setError(
                getApiErrorMessage(
                    loadError,
                    'No se pudo cargar el historial. Intentá de nuevo.'
                )
            );
        } finally {
            setLoading(false);
        }
    }, [appliedFilters, page, pageSize]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFormFilters((current) => ({ ...current, [name]: value }));
        setFilterError('');
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();

        if (formFilters.fromDate && formFilters.toDate
            && formFilters.fromDate > formFilters.toDate) {
            setFilterError('La fecha desde no puede ser posterior a la fecha hasta.');
            return;
        }

        const minAmount = parseAmount(formFilters.minAmount);
        const maxAmount = parseAmount(formFilters.maxAmount);

        if (Number.isNaN(minAmount) || Number.isNaN(maxAmount)) {
            setFilterError('Ingresá un monto válido.');
            return;
        }

        if (minAmount != null && minAmount < 0) {
            setFilterError('El monto mínimo no puede ser negativo.');
            return;
        }

        if (maxAmount != null && maxAmount < 0) {
            setFilterError('El monto máximo no puede ser negativo.');
            return;
        }

        if (minAmount != null && maxAmount != null && minAmount > maxAmount) {
            setFilterError('El monto mínimo no puede ser mayor al monto máximo.');
            return;
        }

        setFilterError('');
        setPage(1);
        setAppliedFilters({ ...formFilters });
    };

    const handleClearFilters = () => {
        setFilterError('');
        setFormFilters(EMPTY_FILTERS);
        setAppliedFilters(EMPTY_FILTERS);
        setPage(1);
    };

    const currentPageSize = pageSize ?? MIN_PAGE_SIZE;
    const canGoPrevious = page > 1 && !loading;
    const canGoNext = totalPages > 0 && page < totalPages && !loading;
    const rangeStart = totalItems === 0 ? 0 : (page - 1) * currentPageSize + 1;
    const rangeEnd = Math.min(page * currentPageSize, totalItems);

    return (
        <main className="historial-page">
            <form className="historial-filters" onSubmit={handleApplyFilters}>
                <div className="filter-group">
                    <label htmlFor="type">Tipo de movimiento</label>
                    <select
                        id="type"
                        name="type"
                        value={formFilters.type}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todos</option>
                        <option value="Deposit">Depósito</option>
                        <option value="Transfer_In">Transferencia recibida</option>
                        <option value="Transfer_Out">Transferencia enviada</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="fromDate">Desde</label>
                    <input
                        id="fromDate"
                        name="fromDate"
                        type="date"
                        value={formFilters.fromDate}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="toDate">Hasta</label>
                    <input
                        id="toDate"
                        name="toDate"
                        type="date"
                        value={formFilters.toDate}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="minAmount">Monto mínimo</label>
                    <input
                        id="minAmount"
                        name="minAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={formFilters.minAmount}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="maxAmount">Monto máximo</label>
                    <input
                        id="maxAmount"
                        name="maxAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={formFilters.maxAmount}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-actions">
                    <button className="filter-button" type="submit" disabled={loading}>
                        Aplicar
                    </button>
                    <button
                        className="filter-button-secondary"
                        type="button"
                        onClick={handleClearFilters}
                        disabled={loading}
                    >
                        Limpiar
                    </button>
                </div>

                {filterError && (
                    <p className="filter-error" role="alert">
                        {filterError}
                    </p>
                )}
            </form>

            <div className="historial-table-wrap" ref={tableWrapRef}>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th className="amount">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((transaction) => {
                            const income = isIncome(transaction.type);
                            const typeLabel = TYPE_LABELS[transaction.type]
                                || transaction.type;

                            return (
                                <tr key={transaction.id}>
                                    <td>{formatDate(transaction.date)}</td>
                                    <td>{typeLabel}</td>
                                    <td>{transaction.description || typeLabel}</td>
                                    <td className={`amount ${income ? 'amount-in' : 'amount-out'}`}>
                                        {income ? '+' : '-'}
                                        {formatCurrency(Math.abs(transaction.amount))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {loading && items.length === 0 && !error && (
                    <div className="historial-status">Cargando movimientos...</div>
                )}

                {error && (
                    <div className="historial-error">
                        <p>{error}</p>
                        <button type="button" onClick={loadHistory}>
                            Reintentar
                        </button>
                    </div>
                )}

                {!error && !loading && totalItems === 0 && (
                    <div className="historial-empty" role="status">
                        {hasActiveFilters(appliedFilters)
                            ? 'No hay movimientos para los filtros seleccionados.'
                            : 'Todavía no tenés movimientos.'}
                    </div>
                )}
            </div>

            {!error && (items.length > 0 || !loading) && (
                <div className="historial-pagination">
                    <span>
                        {totalItems === 0
                            ? '0 movimientos'
                            : `${rangeStart}–${rangeEnd} de ${totalItems} movimientos`}
                    </span>

                    <div className="pagination-actions">
                        <button
                            type="button"
                            onClick={() => setPage((current) => current - 1)}
                            disabled={!canGoPrevious}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {totalPages === 0 ? 0 : page} de {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPage((current) => current + 1)}
                            disabled={!canGoNext}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Historial;
