import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function Dashboard() {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [accountResponse, transactionsResponse] =
                    await Promise.all([
                        axios.get("/api/accounts/me"),
                        axios.get("/api/transactions/me")
                    ]);
                 setAccount(accountResponse.data);
                setTransactions(transactionsResponse.data.slice(0, 5));

            } catch (error) {
                console.error(error);
                setError("No pudimos cargar la información de tu cuenta.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

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
                    <button onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className='dashboard-page'>
            <section className="dashboard-balance">

                <div>
                    <span className="balance-label">
                        Saldo disponible
                    </span>

                    <h2>
                        {formatCurrency(account.price)}
                    </h2>
                </div>

            </section>

            <section className="dashboard-actions">

                <button className="action-button">
                    <span>+</span>
                    Ingresar fondos
                </button>

                <button className="action-button">
                    <span>↗</span>
                    Transferencias
                </button>

                <button className="action-button">
                    <span>↗</span>
                    Historial de movimientos
                </button>

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

                        {/*transactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))*/}

                    </div>
                )}

            </section>

        </main>
    );
}

function TransactionItem({ transaction }) {

    const isIncome = transaction.type === "Deposit"
        || transaction.type === "TransferIn";

    return (
        <div className="transaction-item">

            <div className={`transaction-icon ${isIncome ? "income" : "expense"}`}>
                {isIncome ? "+" : "-"}
            </div>

            <div className="transaction-info">

                <strong>
                    {transaction.type}
                </strong>

                <span>
                    {transaction.counterparty}
                </span>

            </div>

            <div className="transaction-details">

                <strong className={isIncome ? "income-text" : "expense-text"}>
                    {isIncome ? "+" : "-"}
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