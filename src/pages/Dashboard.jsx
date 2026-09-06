import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Counter from "../components/Counter";
import api from "../services/api";
import TransactionService from "../services/TransactionService";
import { getApiErrorMessage } from "../utils/apiError";
import useAuth from "../hooks/useAuth";
import "../styles/pages/dashboard.scss";

import walletIcon from "../assets/images/icons/wallet.svg?raw";
import sendIcon from "../assets/images/icons/send.svg?raw";
import landmarkIcon from "../assets/images/icons/landmark.svg?raw";
import historyIcon from "../assets/images/icons/book-text.svg?raw";
import downloadIcon from "../assets/images/icons/download.svg?raw";
import arrowLeftIcon from "../assets/images/icons/arrow-left.svg?raw";
import arrowRightIcon from "../assets/images/icons/arrow-right.svg?raw";
import eyeIcon from "../assets/images/icons/eye.svg";
import eyeOffIcon from "../assets/images/icons/eye-off.svg";

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

function getAccountAlias(account, user) {
    return account?.alias || user?.alias || "";
}

function isIncome(type) {
    return type === "Deposit" || type === "Transfer_In" || type === "TransferIn";
}

function getTransactionIcon(type) {
    if (type === "Deposit") {
        return downloadIcon;
    }

    if (type === "Transfer_In" || type === "TransferIn") {
        return arrowLeftIcon;
    }

    return arrowRightIcon;
}

function getTransactionIconClass(type) {
    if (type === "Deposit") {
        return "deposit";
    }

    return isIncome(type) ? "income" : "expense";
}

function Icon({ svg }) {
    return (
        <span
            className="dashboard-action-icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

function Dashboard() {
    const { user } = useAuth();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [balanceVisible, setBalanceVisible] = useState(true);

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
                    <div className="dashboard-spinner"></div>
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
    const alias = getAccountAlias(account, user);

    return (
        <main className="dashboard-page">
            <Card title={false} className="dashboard-balance-card">
                <div className="dashboard-balance-header">
                    <p className="dashboard-balance-label">Saldo disponible</p>
                    <button
                        type="button"
                        className="dashboard-balance-toggle"
                        onClick={() => setBalanceVisible((visible) => !visible)}
                        aria-label={balanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
                        aria-pressed={!balanceVisible}
                    >
                        <img
                            src={balanceVisible ? eyeOffIcon : eyeIcon}
                            alt=""
                        />
                    </button>
                </div>
                <h2 className="dashboard-balance-amount">
                    <span className="dashboard-currency">$</span>
                    {balanceVisible ? (
                        <Counter
                            value={balance ?? 0}
                            fractionDigits={2}
                            decimalSeparator=","
                            thousandSeparator="."
                            fontSize={60}
                            padding={0}
                            gap={2}
                            horizontalPadding={0}
                            textColor="currentColor"
                            fontWeight="bold"
                        />
                    ) : (
                        <span className="dashboard-balance-masked">********</span>
                    )}
                </h2>
                <p className="dashboard-alias">Alias: {alias ? alias : "Alias del cliente"}</p>
            </Card>

            <section className="dashboard-actions">
                <Link to="/deposit" className="dashboard-action">
                    <Icon svg={walletIcon} />
                    Ingresar fondos
                </Link>

                <Link to="/transferencias" className="dashboard-action">
                    <Icon svg={sendIcon} />
                    Transferencias
                </Link>

                <Link to="/plazo-fijo" className="dashboard-action">
                    <Icon svg={landmarkIcon} />
                    Plazo fijo
                </Link>

                <Link to="/historial" className="dashboard-action">
                    <Icon svg={historyIcon} />
                    Historial de movimientos
                </Link>
            </section>

            <Card titleName="Actividad reciente" className="dashboard-activity-card">
                {transactions.length === 0 ? (
                    <p className="dashboard-empty">
                        Todavía no tenés movimientos.
                    </p>
                ) : (
                    transactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                        />
                    ))
                )}
            </Card>
        </main>
    );
}

function TransactionItem({ transaction }) {
    const income = isIncome(transaction.type);
    const typeLabel = TYPE_LABELS[transaction.type] || transaction.type;
    const iconClass = getTransactionIconClass(transaction.type);
    const subtitle = [
        transaction.counterparty || transaction.description,
        formatActivityDate(transaction.date),
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="dashboard-transaction">
            <div className={`dashboard-transaction-icon ${iconClass}`}>
                <span
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{
                        __html: getTransactionIcon(transaction.type),
                    }}
                />
            </div>

            <div className="dashboard-transaction-info">
                <strong>{typeLabel}</strong>
                <span>{subtitle || typeLabel}</span>
            </div>

            <strong className={`dashboard-transaction-amount${income ? " income" : ""}`}>
                {income ? "+ " : "- "}
                {formatCurrency(Math.abs(transaction.amount))}
            </strong>
        </div>
    );
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
}

function formatActivityDate(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const time = new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
        return `Hoy, ${time}`;
    }

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default Dashboard;
