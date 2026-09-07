import Card from "../components/Card";
import TransferForm from "../components/TransferForm";
import useRealtime from "../hooks/useRealtime";
import "../styles/pages/transfer.scss";

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
}

function Transferencias() {
    const {
        balance,
        accountLoading: balanceLoading,
        accountError: balanceError,
        refreshAccount,
    } = useRealtime();

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
                        <p className="transfer-balance-error">
                            {balanceError}{" "}
                            <button type="button" onClick={refreshAccount}>
                                Reintentar
                            </button>
                        </p>
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
