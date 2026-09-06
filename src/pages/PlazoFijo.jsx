import { useCallback, useEffect, useState } from "react";
import Card from "../components/Card";
import FixedDepositForm from "../components/FixedDepositForm";
import api from "../services/api";
import FixedDepositService from "../services/FixedDepositService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/plazo-fijo.scss";

const STATUS_LABELS = {
    0: "Activo",
    1: "Vencido",
    2: "Cancelado",
    Active: "Activo",
    Matured: "Vencido",
    Completed: "Vencido",
    Cancelled: "Cancelado",
};

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value ?? 0);
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function formatRate(rate) {
    if (rate == null) {
        return "—";
    }

    return `${FixedDepositService.toRatePercent(rate).toLocaleString("es-AR", {
        maximumFractionDigits: 2,
    })}%`;
}

function getStatusLabel(status) {
    if (status == null) {
        return "—";
    }

    return STATUS_LABELS[status] || String(status);
}

function getStatusClass(status) {
    const label = getStatusLabel(status);

    if (label === "Activo") {
        return "active";
    }

    if (label === "Vencido") {
        return "matured";
    }

    if (label === "Cancelado") {
        return "cancelled";
    }

    return "";
}

function getAccountBalance(account) {
    if (!account) {
        return null;
    }

    const value = account.balance ?? account.availableBalance ?? account.price;

    return Number.isFinite(Number(value)) ? Number(value) : null;
}

function PlazoFijo() {
    const [account, setAccount] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(true);
    const [balanceError, setBalanceError] = useState("");

    const [deposits, setDeposits] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [listError, setListError] = useState("");

    const loadBalance = useCallback(async () => {
        try {
            setBalanceLoading(true);
            setBalanceError("");
            const response = await api.get("accounts/me");
            setAccount(response.data);
        } catch (error) {
            setAccount(null);
            setBalanceError(
                getApiErrorMessage(error, "No pudimos cargar tu saldo.")
            );
        } finally {
            setBalanceLoading(false);
        }
    }, []);

    const loadDeposits = useCallback(async () => {
        try {
            setListLoading(true);
            setListError("");
            const items = await FixedDepositService.getMine();
            setDeposits(items);
        } catch (error) {
            setDeposits([]);
            setListError(
                getApiErrorMessage(
                    error,
                    "No pudimos cargar tus plazos fijos."
                )
            );
        } finally {
            setListLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadPage = async () => {
            const [accountResult, depositsResult] = await Promise.allSettled([
                api.get("accounts/me"),
                FixedDepositService.getMine(),
            ]);

            if (cancelled) {
                return;
            }

            if (accountResult.status === "fulfilled") {
                setAccount(accountResult.value.data);
                setBalanceError("");
            } else {
                setAccount(null);
                setBalanceError(
                    getApiErrorMessage(
                        accountResult.reason,
                        "No pudimos cargar tu saldo."
                    )
                );
            }

            if (depositsResult.status === "fulfilled") {
                setDeposits(depositsResult.value);
                setListError("");
            } else {
                setDeposits([]);
                setListError(
                    getApiErrorMessage(
                        depositsResult.reason,
                        "No pudimos cargar tus plazos fijos."
                    )
                );
            }

            setBalanceLoading(false);
            setListLoading(false);
        };

        loadPage();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleCreated = () => {
        loadBalance();
        loadDeposits();
    };

    const balance = getAccountBalance(account);
    const annualRate = deposits.find((item) => item.annualRate != null)?.annualRate
        ?? FixedDepositService.FALLBACK_ANNUAL_RATE;

    return (
        <main className="plazo-page">
            <div className="plazo-layout">
                <Card
                    titleName="Nuevo plazo fijo"
                    className="plazo-form-card"
                >
                    <FixedDepositForm
                        availableBalance={balance}
                        annualRate={annualRate}
                        onCreated={handleCreated}
                    />
                </Card>

                <Card title={false} className="plazo-balance-card">
                    <p className="plazo-balance-label">Tu saldo</p>

                    {balanceLoading ? (
                        <p className="plazo-balance-amount">Cargando...</p>
                    ) : balanceError ? (
                        <p className="plazo-balance-error">{balanceError}</p>
                    ) : (
                        <p className="plazo-balance-amount">
                            {formatCurrency(balance ?? 0)}
                        </p>
                    )}

                    <p className="plazo-balance-caption">
                        Disponible para invertir
                    </p>

                    <div className="plazo-balance-note">
                        <strong>Sin cancelación anticipada</strong>
                        <p>
                            El capital queda inmovilizado hasta el vencimiento.
                            No se puede cancelar el plazo fijo antes de esa fecha.
                        </p>
                    </div>
                </Card>
            </div>

            <Card titleName="Tus plazos fijos" className="plazo-list-card">
                {listLoading && deposits.length === 0 && !listError ? (
                    <p className="plazo-list-status">Cargando plazos fijos...</p>
                ) : listError ? (
                    <div className="plazo-list-error">
                        <p>{listError}</p>
                        <button type="button" onClick={loadDeposits}>
                            Reintentar
                        </button>
                    </div>
                ) : deposits.length === 0 ? (
                    <p className="plazo-list-empty">
                        Todavía no tenés plazos fijos.
                    </p>
                ) : (
                    <div className="plazo-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Monto</th>
                                    <th>Plazo</th>
                                    <th>TNA</th>
                                    <th>Interés</th>
                                    <th>Monto final</th>
                                    <th>Inicio</th>
                                    <th>Vencimiento</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposits.map((deposit) => (
                                    <tr key={deposit.id}>
                                        <td>{formatCurrency(deposit.amount)}</td>
                                        <td>
                                            {deposit.termDays != null
                                                ? `${deposit.termDays} días`
                                                : "—"}
                                        </td>
                                        <td>{formatRate(deposit.annualRate)}</td>
                                        <td>
                                            {deposit.interestAmount != null
                                                ? formatCurrency(deposit.interestAmount)
                                                : "—"}
                                        </td>
                                        <td>
                                            {deposit.finalAmount != null
                                                ? formatCurrency(deposit.finalAmount)
                                                : "—"}
                                        </td>
                                        <td>{formatDate(deposit.createdAt)}</td>
                                        <td>{formatDate(deposit.maturityDate)}</td>
                                        <td>
                                            <span
                                                className={`plazo-status ${getStatusClass(deposit.status)}`}
                                            >
                                                {getStatusLabel(deposit.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </main>
    );
}

export default PlazoFijo;
