import { useEffect, useState } from "react";
import Card from "../components/Card";
import TransferForm from "../components/TransferForm";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/transfer.scss";

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
}

function getAccountBalance(account) {
    if (!account) {
        return null;
    }

    const value = account.balance ?? account.availableBalance ?? account.price;

    return Number.isFinite(Number(value)) ? Number(value) : null;
}

function Transferencias() {
    const [account, setAccount] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(true);
    const [balanceError, setBalanceError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadBalance = async () => {
            try {
                setBalanceLoading(true);
                setBalanceError("");
                const response = await api.get("accounts/me");

                if (!cancelled) {
                    setAccount(response.data);
                }
            } catch (error) {
                if (!cancelled) {
                    setAccount(null);
                    setBalanceError(
                        getApiErrorMessage(
                            error,
                            "No pudimos cargar tu saldo."
                        )
                    );
                }
            } finally {
                if (!cancelled) {
                    setBalanceLoading(false);
                }
            }
        };

        loadBalance();

        return () => {
            cancelled = true;
        };
    }, []);

    const balance = getAccountBalance(account);

    return (
        <main className="transfer-page">
            <div className="transfer-layout">
                <Card
                    titleName="Nueva transferencia"
                    className="transfer-form-card"
                >
                    <TransferForm />
                </Card>

                <Card title={false} className="transfer-balance-card">
                    <p className="transfer-balance-label">Tu saldo</p>

                    {balanceLoading ? (
                        <p className="transfer-balance-amount">Cargando...</p>
                    ) : balanceError ? (
                        <p className="transfer-balance-error">{balanceError}</p>
                    ) : (
                        <p className="transfer-balance-amount">
                            {formatCurrency(balance ?? 0)}
                        </p>
                    )}

                    <p className="transfer-balance-caption">
                        Disponible para transferir
                    </p>

                    <div className="transfer-balance-note">
                        <strong>Transferencias protegidas</strong>
                        <p>
                            Validamos cada destinatario antes de que confirmes
                            la operación.
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
}

export default Transferencias;
