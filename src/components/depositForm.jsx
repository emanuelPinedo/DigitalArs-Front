import { useState } from "react"; 
import TransactionService from "../services/TransactionService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/transfer.scss";
import useAuth from "../hooks/useAuth.jsx";

const STEPS = [
    { id: 1, label: "Importe" },
    { id: 2, label: "Confirmación" },
];

function DepositForm() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function canVisitStep(id) {
        if (id === 1) return true; //EL id define en que pagina esta la actualmente las pestañas, 1 es para importe, 2 confirmacion 
        return Number(amount) > 0;
    }

    function goToStep(id) {
        if (canVisitStep(id)) {
            setStep(id);
            cleanMessages()
        }
    }
    
    function cleanMessages() { //cualquier mensaje de error o exito se limpia al llamar este metodo
        setErrorMessage("")
        setSuccessMessage("")
    }
    
    async function handleConfirm() {
        setSubmitting(true);
        setErrorMessage("");
        try {
            const result = await TransactionService.deposit({
                accountId: user.accountId,
                amount: Number(amount),
            });
            setSuccessMessage(`Depósito realizado con éxito. Nuevo saldo: $${result.newBalance ?? "—"}`);
            setAmount("");
            setStep(1);
        } catch (err) {
            setErrorMessage(getApiErrorMessage(err, "No se pudo realizar el depósito."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="transfer-form">
            <nav className="transfer-steps" aria-label="Pasos del depósito">
                {STEPS.map((item) => {
                    const isActive = step === item.id;
                    const isClickable = canVisitStep(item.id);
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`transfer-step ${isActive ? "active" : ""}`}
                            disabled={!isClickable || submitting}
                            onClick={() => goToStep(item.id)}
                        >
                            {item.id} {item.label}
                        </button>
                    );
                })}
            </nav>

            {step === 1 && (
                <div className="transfer-field">
                    <label htmlFor="amount">Monto</label>
                    <input
                        className="transfer-input"
                        type="text"
                        id="amount"
                        name="amount"
                        placeholder="$ 0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            )}

            {step === 2 && (
                <div className="transfer-summary">
                    <p>Vas a depositar:</p>
                    <p className="transfer-summary-amount">${Number(amount).toFixed(2)}</p>
                </div>
            )}

            {successMessage && (
                <div className="transfer-banner-success" role="status">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="transfer-banner-error" role="status">{errorMessage}</div>
            )}

            <div className="transfer-actions">
                <button
                    type="button"
                    className="transfer-button transfer-button-secondary"
                    onClick={() => {
                        setAmount("")
                        setStep(1)
                        cleanMessages()
                    }
                    
                }
                    disabled={submitting}
                >
                    Cancelar
                </button>

                {step === 1 && (
                    <button
                        type="button"
                        className="transfer-button transfer-button-primary"
                        onClick={() => goToStep(2)}
                        disabled={!canVisitStep(2)}
                    >
                        Continuar
                    </button>
                )}

                {step === 2 && (
                    <button
                        type="button"
                        className="transfer-button transfer-button-primary"
                        onClick={handleConfirm}
                        disabled={submitting}
                    >
                        {submitting ? "Procesando..." : "Confirmar"}
                    </button>
                )}
            </div>
        </form>
    );
}

export default DepositForm;