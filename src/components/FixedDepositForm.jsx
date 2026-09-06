import { useState } from "react";
import FixedDepositService from "../services/FixedDepositService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/plazo-fijo.scss";

const STEPS = [
    { id: 1, label: "Datos" },
    { id: 2, label: "Confirmación" },
];

function parseAmount(value) {
    return Number(String(value).replace(",", "."));
}

function parseDays(value) {
    const parsed = Number(String(value).trim());

    if (!Number.isInteger(parsed)) {
        return NaN;
    }

    return parsed;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function formatRate(rate) {
    return `${FixedDepositService.toRatePercent(rate).toLocaleString("es-AR", {
        maximumFractionDigits: 2,
    })}%`;
}

function addDays(days) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date;
}

function FixedDepositForm({ availableBalance, annualRate, onCreated }) {
    const [step, setStep] = useState(1);
    const [maxReachedStep, setMaxReachedStep] = useState(1);

    const [amount, setAmount] = useState("");
    const [termDays, setTermDays] = useState("");

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const parsedAmount = parseAmount(amount);
    const parsedDays = parseDays(termDays);
    const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
    const hasValidDays = Number.isInteger(parsedDays) && parsedDays > 0;
    const rate = annualRate ?? FixedDepositService.FALLBACK_ANNUAL_RATE;
    const estimate = hasValidAmount && hasValidDays
        ? FixedDepositService.estimateInterest({
            amount: parsedAmount,
            termDays: parsedDays,
            annualRate: rate,
        })
        : null;
    const estimatedMaturity = hasValidDays ? addDays(parsedDays) : null;

    const canVisitStep = (id) => {
        if (id === 1) {
            return true;
        }

        return maxReachedStep >= 2 && hasValidAmount && hasValidDays;
    };

    const resetFeedback = () => {
        setServerError("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setStep(1);
        setMaxReachedStep(1);
        setAmount("");
        setTermDays("");
        setErrors({});
    };

    const validateStepOne = () => {
        const nextErrors = {};

        if (!hasValidAmount) {
            nextErrors.amount = "El monto debe ser mayor a 0.";
        } else if (
            Number.isFinite(availableBalance)
            && parsedAmount > availableBalance
        ) {
            nextErrors.amount = "El monto supera tu saldo disponible.";
        }

        if (!hasValidDays) {
            nextErrors.termDays = "Ingresá un plazo en días entero y mayor a 0.";
        }

        return nextErrors;
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

    const handleTermDaysChange = (event) => {
        setTermDays(event.target.value);
        setErrors((prev) => ({ ...prev, termDays: "" }));
        resetFeedback();
    };

    const handleContinue = () => {
        resetFeedback();

        const nextErrors = validateStepOne();

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
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

        const nextErrors = validateStepOne();

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setStep(1);
            return;
        }

        try {
            setSubmitting(true);

            const created = await FixedDepositService.create({
                amount: parsedAmount,
                termDays: parsedDays,
            });

            setSuccessMessage(
                `Plazo fijo constituido. Interés ${formatCurrency(created.interestAmount ?? 0)} · al vencimiento recibís ${formatCurrency(created.finalAmount ?? 0)}.`
            );
            resetForm();
            onCreated?.(created);
        } catch (error) {
            setServerError(
                getApiErrorMessage(
                    error,
                    "No se pudo constituir el plazo fijo. Revisá el monto, el plazo y tu saldo."
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="plazo-form" onSubmit={handleConfirm}>
            <nav className="plazo-steps" aria-label="Pasos del plazo fijo">
                {STEPS.map((item) => {
                    const isActive = step === item.id;
                    const isClickable = canVisitStep(item.id);

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`plazo-step ${isActive ? "active" : ""}`}
                            disabled={!isClickable || submitting}
                            onClick={() => goToStep(item.id)}
                        >
                            {item.id} {item.label}
                        </button>
                    );
                })}
            </nav>

            {successMessage && (
                <div className="plazo-banner plazo-banner-success" role="status">
                    {successMessage}
                </div>
            )}

            {step === 1 && (
                <>
                <div className="plazo-form-content">
                    <div className="plazo-field">
                        <label htmlFor="amount">Monto a invertir</label>
                        <input
                            className="plazo-input"
                            type="number"
                            id="amount"
                            name="amount"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            value={amount}
                            onChange={handleAmountChange}
                            disabled={submitting}
                        />
                        {errors.amount && (
                            <span className="plazo-error">{errors.amount}</span>
                        )}
                    </div>

                    <div className="plazo-field">
                        <label htmlFor="termDays">Plazo (días)</label>
                        <input
                            className="plazo-input"
                            type="number"
                            id="termDays"
                            name="termDays"
                            min="1"
                            step="1"
                            placeholder="30"
                            value={termDays}
                            onChange={handleTermDaysChange}
                            disabled={submitting}
                        />
                        {errors.termDays && (
                            <span className="plazo-error">{errors.termDays}</span>
                        )}
                    </div>
                </div>
                    {estimate && (
                        <div className="plazo-preview" aria-live="polite">
                            <p className="plazo-preview-label">Simulación estimada</p>
                            <dl>
                                <div>
                                    <dt>TNA</dt>
                                    <dd>{formatRate(rate)}</dd>
                                </div>
                                <div>
                                    <dt>Interés estimado</dt>
                                    <dd>{formatCurrency(estimate.interestAmount)}</dd>
                                </div>
                                <div>
                                    <dt>Monto final estimado</dt>
                                    <dd>{formatCurrency(estimate.finalAmount)}</dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    <div className="plazo-actions">
                        <button
                            type="button"
                            className="plazo-button plazo-button-secondary"
                            onClick={resetForm}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="plazo-button plazo-button-primary"
                            onClick={handleContinue}
                            disabled={submitting || !hasValidAmount || !hasValidDays}
                        >
                            Continuar
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="plazo-summary">
                        <h2>Resumen del plazo fijo</h2>
                        <p className="plazo-summary-caption">
                            Los valores de interés son una estimación. El banco confirma
                            el rendimiento al constituir el plazo.
                        </p>
                        <dl>
                            <div>
                                <dt>Monto</dt>
                                <dd>{formatCurrency(parsedAmount)}</dd>
                            </div>
                            <div>
                                <dt>Plazo</dt>
                                <dd>{parsedDays} días</dd>
                            </div>
                            <div>
                                <dt>TNA estimada</dt>
                                <dd>{formatRate(rate)}</dd>
                            </div>
                            <div>
                                <dt>Interés estimado</dt>
                                <dd>{formatCurrency(estimate?.interestAmount ?? 0)}</dd>
                            </div>
                            <div>
                                <dt>Monto final estimado</dt>
                                <dd>{formatCurrency(estimate?.finalAmount ?? 0)}</dd>
                            </div>
                            <div>
                                <dt>Vencimiento</dt>
                                <dd>{formatDate(estimatedMaturity)}</dd>
                            </div>
                        </dl>
                    </div>

                    {serverError && (
                        <div className="plazo-banner plazo-banner-error">
                            {serverError}
                        </div>
                    )}

                    <div className="plazo-actions">
                        <button
                            type="button"
                            className="plazo-button plazo-button-secondary"
                            onClick={() => goToStep(1)}
                            disabled={submitting}
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            className="plazo-button plazo-button-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Constituyendo..." : "Confirmar"}
                        </button>
                    </div>
                </>
            )}
        </form>
    );
}

export default FixedDepositForm;
