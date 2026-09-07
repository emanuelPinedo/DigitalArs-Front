import { useRef, useState } from "react";
import AccountService from "../services/AccountService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/deposit.scss";

const STEPS = [
    { id: 1, label: "Importe" },
    { id: 2, label: "Confirmación" },
];

const MAX_DEPOSIT_AMOUNT = 1_000_000;

function parseAmount(value) {
    return Number(String(value).replace(",", "."));
}

function hasMaxTwoDecimals(value) {
    const normalized = String(value).trim().replace(",", ".");
    const match = normalized.match(/^-?\d+(?:\.(\d+))?$/);

    if (!match) {
        return true;
    }

    return !match[1] || match[1].length <= 2;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
}

function DepositForm({ onCreated }) {
    const [step, setStep] = useState(1);
    const [maxReachedStep, setMaxReachedStep] = useState(1);

    const [amount, setAmount] = useState("");

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const parsedAmount = parseAmount(amount);
    const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;

    const canVisitStep = (id) => {
        if (id === 1) {
            return true;
        }

        return maxReachedStep >= 2 && hasValidAmount;
    };

    const resetFeedback = () => {
        setServerError("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setStep(1);
        setMaxReachedStep(1);
        setAmount("");
        setErrors({});
    };

    const validateAmount = () => {
        if (!hasValidAmount) {
            return "El monto debe ser mayor a 0.";
        }

        if (!hasMaxTwoDecimals(amount)) {
            return "El monto admite como máximo 2 decimales.";
        }

        if (parsedAmount > MAX_DEPOSIT_AMOUNT) {
            return `El monto máximo por depósito es de ${formatCurrency(MAX_DEPOSIT_AMOUNT)}.`;
        }

        return "";
    };

    const goToStep = (nextStep) => {
        if (!canVisitStep(nextStep) && nextStep !== step) {
            return;
        }

        setErrors({});
        resetFeedback();
        setStep(nextStep);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
        setErrors((prev) => ({ ...prev, amount: "" }));
        resetFeedback();
    };

    const handleCancel = () => {
        resetForm();
        resetFeedback();
    };

    const handleContinue = () => {
        resetFeedback();

        const amountError = validateAmount();

        if (amountError) {
            setErrors({ amount: amountError });
            return;
        }

        setErrors({});
        setMaxReachedStep((current) => Math.max(current, 2));
        setStep(2);
    };

    const handleConfirm = async (event) => {
        event.preventDefault();
        resetFeedback();

        if (step !== 2) {
            return;
        }

        const amountError = validateAmount();

        if (amountError) {
            setErrors({ amount: amountError });
            setStep(1);
            return;
        }

        if (submittingRef.current) {
            return;
        }

        try {
            submittingRef.current = true;
            setSubmitting(true);

            await AccountService.deposit({ amount: parsedAmount });

            setSuccessMessage(
                `Depósito acreditado por ${formatCurrency(parsedAmount)}.`
            );
            resetForm();
            onCreated?.();
        } catch (error) {
            setServerError(
                getApiErrorMessage(
                    error,
                    "No se pudo completar el depósito. Revisá el monto e intentá de nuevo."
                )
            );
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    };

    return (
        <form className="deposit-form" onSubmit={handleConfirm}>
            <nav className="deposit-steps" aria-label="Pasos del depósito">
                {STEPS.map((item) => {
                    const isActive = step === item.id;
                    const isClickable = canVisitStep(item.id);

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`deposit-step ${isActive ? "active" : ""}`}
                            disabled={!isClickable || submitting}
                            onClick={() => goToStep(item.id)}
                        >
                            {item.id} {item.label}
                        </button>
                    );
                })}
            </nav>

            {successMessage && (
                <div className="deposit-banner deposit-banner-success" role="status">
                    {successMessage}
                </div>
            )}

            {step === 1 && (
                <>
                    <div className="deposit-field">
                        <label htmlFor="amount">Monto</label>
                        <input
                            className="deposit-input"
                            type="number"
                            id="amount"
                            name="amount"
                            min="0"
                            step="0.01"
                            placeholder="$ 0,00"
                            value={amount}
                            onChange={handleAmountChange}
                            disabled={submitting}
                        />
                        {errors.amount && (
                            <span className="deposit-error">{errors.amount}</span>
                        )}
                    </div>

                    <div className="deposit-actions">
                        <button
                            type="button"
                            className="deposit-button deposit-button-secondary"
                            onClick={handleCancel}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="deposit-button deposit-button-primary"
                            onClick={handleContinue}
                            disabled={submitting || Boolean(validateAmount())}
                        >
                            Continuar
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="deposit-summary">
                        <h2>Resumen del depósito</h2>
                        <dl>
                            <div>
                                <dt>Monto</dt>
                                <dd>{formatCurrency(parsedAmount)}</dd>
                            </div>
                        </dl>
                    </div>

                    {serverError && (
                        <div className="deposit-banner deposit-banner-error">
                            {serverError}
                        </div>
                    )}

                    <div className="deposit-actions">
                        <button
                            type="button"
                            className="deposit-button deposit-button-secondary"
                            onClick={() => goToStep(1)}
                            disabled={submitting}
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            className="deposit-button deposit-button-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Depositando..." : "Confirmar"}
                        </button>
                    </div>
                </>
            )}
        </form>
    );
}

export default DepositForm;
