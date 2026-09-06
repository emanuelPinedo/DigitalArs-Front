import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import TransactionService from "../services/TransactionService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/dashboard.css";

const TYPE_LABELS = {
    Deposit: "Depósito",
    Transfer_In: "Transferencia recibida",
    Transfer_Out: "Transferencia enviada",
};

function getAccountBalance(account) {
    if (!account) {
        return null;
    }

    const value = account.balance ?? account.availableBalance ?? account.price;

    return Number.isFinite(Number(value)) ? Number(value) : null;
}

function Dashboard() {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [accountResponse, transactionsData] = await Promise.all([
                api.get("accounts/me"),
                TransactionService.getMine({ page: 1, pageSize: 5 }),
            ]);

            setAccount(accountResponse.data);
            setTransactions(
                Array.isArray(transactionsData?.items)
                    ? transactionsData.items
                    : Array.isArray(transactionsData)
                        ? transactionsData.slice(0, 5)
                        : []
            );
        } catch (loadError) {
            console.error(loadError);
            setError(
                getApiErrorMessage(
                    loadError,
                    "No pudimos cargar la información de tu cuenta."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Cargando tu cuenta...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-error">
                    <p>{error}</p>
                    <button type="button" onClick={loadDashboard}>
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    const balance = getAccountBalance(account);

    return (
        <main className="dashboard-page">
            <section className="dashboard-balance">
                <div>
                    <span className="balance-label">
                        Saldo disponible
                    </span>

                    <h2>
                        {formatCurrency(balance ?? 0)}
                    </h2>
                </div>
            </section>

            <section className="dashboard-actions">
                <Link to="/deposit" className="action-button">
                    <span>+</span>
                    Ingresar fondos
                </Link>

                <Link to="/transferencias" className="action-button">
                    <span>↗</span>
                    Transferencias
                </Link>

                <Link to="/historial" className="action-button">
                    <span>↗</span>
                    Historial de movimientos
                </Link>
            </section>

            <section className="transactions-section">
                <div className="transactions-header">
                    <h2>Últimos movimientos</h2>
                </div>

                {transactions.length === 0 ? (
                    <p className="empty-transactions">
                        Todavía no tenés movimientos.
                    </p>
                ) : (
                    <div className="transactions-list">
                        {transactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function TransactionItem({ transaction }) {
    const income = transaction.type === "Deposit"
        || transaction.type === "Transfer_In"
        || transaction.type === "TransferIn";

    const typeLabel = TYPE_LABELS[transaction.type] || transaction.type;

    return (
        <div className="transaction-item">
            <div className={`transaction-icon ${income ? "income" : "expense"}`}>
                {income ? "+" : "-"}
            </div>

            <div className="transaction-info">
                <strong>
                    {typeLabel}
                </strong>

                <span>
                    {transaction.description || transaction.counterparty || typeLabel}
                </span>
            </div>

            <div className="transaction-details">
                <strong className={income ? "income-text" : "expense-text"}>
                    {income ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                </strong>

                <span>
                    {formatDate(transaction.date)}
                </span>
            </div>
        </div>
    );
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    }).format(value);
}

function formatDate(value) {
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(value));
}

export default Dashboard;
