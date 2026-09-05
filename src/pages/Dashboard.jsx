import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    }).format(value);
};

const isIncoming = (type) => {
    return type === "Deposit" || type === "Transfer_In";
};

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

                const accountResponse = await axios.get("/api/accounts/me");

                const transactionsResponse = await axios.get(
                    "/api/transactions/me?page=1&pageSize=5"
                );
                
                setAccount(accountResponse.data);
                setTransactions(transactionsResponse.data.items);

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
                    <p>Cargando billetera...</p>
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
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Una vista simple de tus finanzas</p>
                </div>
            </header>

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
                    Ingresar fondos
                </button>

                <button className="action-button">
                    Transferencias
                </button>

                <button className="action-button">
                    Historial de movimientos
                </button>

            </section>

            <section className="transactions-section">

                <div className="transactions-header">
                    <h2>Actividad reciente</h2>
                </div>

                {transactions.length === 0 ? (
                    <p className="empty-transactions">
                        Todavía no tenés movimientos.
                    </p>
                ) : (
                    <div className="transactions-list">

                        {transactions.map((transaction) => {
                            const incoming = isIncoming(transaction.type);

                            return (
                                <div key={transaction.id}>
                                    <p>{transaction.description}</p>
                                    <span>
                                        {incoming ? "+" : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                    <p>{transaction.date}</p>
                                </div>
                            );
                        })}
                    </div>
                )};

            </section>

        </main>
    );
}

/* esto creo que ya viene bien del backend
function formatDate(value) {
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(value));
}
*/

export default Dashboard;