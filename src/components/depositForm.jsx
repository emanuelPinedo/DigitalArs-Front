import { useState } from "react";
import UserService from "../services/UserService";
import TransactionService from "../services/TransactionService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/transfer.scss";

const STEPS = [
    { id: 1, label: "Importe" },
    { id: 2, label: "Confirmación" },
];

function DepositForm() {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");

    function canVisitStep(id) {
        if (id === 1) return true; //EL id define en que pagina esta la actualmente las pestañas, 1 es para importe, 2 confirmacion 
        return Number(amount) > 0;
    }

    function goToStep(id) {
        if (canVisitStep(id)) setStep(id);
    }

    return (
        <form className="transfer-form">
            <nav className="transfer-steps" 
                 aria-label="Pasos del depósito"
            >
                {STEPS.map((item) => {
                    const isActive = step === item.id;
                    const isClickable = canVisitStep(item.id);

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`transfer-step ${isActive ? "active" : ""}`}
                            disabled={!isClickable}
                            onClick={() => goToStep(item.id)}
                        >
                            {item.id} {item.label}
                        </button>
                    );
                })
                }
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

            <div className="transfer-actions">
                <button
                    type="button"
                    className="transfer-button transfer-button-secondary"
                    onClick={() => setAmount("")}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className="transfer-button transfer-button-primary"
                    onClick={() => goToStep(2)}
                    disabled={!canVisitStep(2)}
                >
                    Continuar
                </button>
            </div>
        </form>
    );
}

export default DepositForm;