import { useEffect, useRef, useState } from "react";
import UserService from "../services/UserService";
import TransactionService from "../services/TransactionService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/transfer.scss";

const STEPS = [
    { id: 1, label: "Destinatario" },
    { id: 2, label: "Importe" },
    { id: 3, label: "Confirmación" },
];

function parseAmount(value) {
    return Number(String(value).replace(",", "."));
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
}

function formatRecipientMeta(user) {
    const parts = [];

    if (user?.alias) {
        parts.push(user.alias);
    }

    if (user?.cuit) {
        parts.push(`CUIT ${user.cuit}`);
    } else if (user?.dni) {
        parts.push(`DNI ${user.dni}`);
    }

    return parts.join(" · ");
}

function TransferForm() {
    const [step, setStep] = useState(1);
    const [maxReachedStep, setMaxReachedStep] = useState(1);

    const [alias, setAlias] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [matches, setMatches] = useState([]);
    const [recipient, setRecipient] = useState(null);

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchHint, setSearchHint] = useState("");

    const [searching, setSearching] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const searchRequestId = useRef(0);

    const parsedAmount = parseAmount(amount);
    const hasRecipient = recipient?.accountId != null;
    const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;

    const canVisitStep = (id) => {
        if (id === 1) {
            return true;
        }

        if (id === 2) {
            return maxReachedStep >= 2 && hasRecipient;
        }

        return maxReachedStep >= 3 && hasRecipient && hasValidAmount;
    };

    const resetFeedback = () => {
        setServerError("");
        setSuccessMessage("");
    };

    useEffect(() => {
        const trimmedAlias = alias.trim();

        if (!trimmedAlias) {
            searchRequestId.current += 1;
            setMatches([]);
            setRecipient(null);
            setSearching(false);
            setSearchHint("");
            return undefined;
        }

        const requestId = ++searchRequestId.current;
        setSearching(true);
        setSearchHint("");

        const timeoutId = setTimeout(async () => {
            try {
                const results = await UserService.searchByAlias(trimmedAlias);

                if (requestId !== searchRequestId.current) {
                    return;
                }

                const list = Array.isArray(results)
                    ? results
                    : results
                        ? [results]
                        : [];
                setMatches(list);

                const uniqueMatch =
                    list.length === 1 && list[0].accountId != null
                        ? list[0]
                        : null;

                setRecipient(uniqueMatch);
                setSearchHint(
                    list.length === 0
                        ? "No encontramos un usuario con ese alias."
                        : ""
                );
            } catch (error) {
                if (requestId !== searchRequestId.current) {
                    return;
                }

                setMatches([]);
                setRecipient(null);
                setSearchHint(
                    getApiErrorMessage(
                        error,
                        "No pudimos buscar el destinatario. Intentá de nuevo."
                    )
                );
            } finally {
                if (requestId === searchRequestId.current) {
                    setSearching(false);
                }
            }
        }, 300);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [alias]);

    const handleAliasChange = (event) => {
        setAlias(event.target.value);
        setRecipient(null);
        setErrors((prev) => ({ ...prev, alias: "", recipient: "" }));
        resetFeedback();
    };

    const handleSelectRecipient = (user) => {
        if (user.accountId == null) {
            return;
        }

        setRecipient(user);
        setErrors((prev) => ({ ...prev, recipient: "" }));
        resetFeedback();
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
        setErrors((prev) => ({ ...prev, amount: "" }));
        resetFeedback();
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        resetFeedback();
    };

    const goToStep = (nextStep) => {
        if (!canVisitStep(nextStep) && nextStep !== step) {
            return;
        }

        setErrors({});
        resetFeedback();
        setStep(nextStep);
    };

    const handleCancel = () => {
        resetForm();
        resetFeedback();
    };

    const handleContinueFromRecipient = () => {
        resetFeedback();

        if (!hasRecipient) {
            setErrors({
                recipient: "Seleccioná un destinatario antes de continuar.",
            });
            return;
        }

        setErrors({});
        setMaxReachedStep((current) => Math.max(current, 2));
        setStep(2);
    };

    const handleContinueFromAmount = () => {
        resetFeedback();

        if (!hasValidAmount) {
            setErrors({ amount: "El monto debe ser mayor a 0." });
            return;
        }

        setErrors({});
        setMaxReachedStep((current) => Math.max(current, 3));
        setStep(3);
    };

    const resetForm = () => {
        setStep(1);
        setMaxReachedStep(1);
        setAlias("");
        setAmount("");
        setDescription("");
        setMatches([]);
        setRecipient(null);
        setErrors({});
        setSearchHint("");
    };

    const handleConfirm = async (event) => {
        event.preventDefault();
        resetFeedback();

        if (step !== 3) {
            return;
        }

        if (!hasRecipient || !hasValidAmount) {
            return;
        }

        try {
            setSubmitting(true);

            await TransactionService.transfer({
                destinationAccountId: recipient.accountId,
                amount: parsedAmount,
                description,
            });

            setSuccessMessage(
                `Transferencia enviada a ${recipient.fullName}.`
            );
            resetForm();
        } catch (error) {
            setServerError(
                getApiErrorMessage(
                    error,
                    "No se pudo completar la transferencia. Intentá de nuevo."
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="transfer-form" onSubmit={handleConfirm}>
            <nav className="transfer-steps" aria-label="Pasos de la transferencia">
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

            {successMessage && (
                <div className="transfer-banner transfer-banner-success" role="status">
                    {successMessage}
                </div>
            )}

            {step === 1 && (
                <>
                    <div className="transfer-field">
                        <label htmlFor="alias">Alias del destinatario</label>
                        <input
                            className="transfer-input"
                            type="text"
                            id="alias"
                            name="alias"
                            placeholder="ej. lucia.fernandez.mp"
                            value={alias}
                            onChange={handleAliasChange}
                            disabled={submitting}
                            autoComplete="off"
                        />
                        {searching && (
                            <span className="transfer-hint">Buscando...</span>
                        )}
                        {errors.alias && (
                            <span className="transfer-error">{errors.alias}</span>
                        )}
                    </div>

                    {hasRecipient && (
                        <div className="recipient-verified">
                            <div>
                                <h5>{recipient.fullName}</h5>
                                <p>{formatRecipientMeta(recipient)}</p>
                            </div>
                            <span className="recipient-verified-status">
                                ✓ Verificado
                            </span>
                        </div>
                    )}

                    {!hasRecipient && matches.length > 0 && (
                        <ul className="recipient-list">
                            {matches.map((user) => {
                                const hasAccount = user.accountId != null;
                                const isSelected = recipient?.id === user.id;

                                return (
                                    <li key={user.id}>
                                        <button
                                            type="button"
                                            className={`recipient-option ${isSelected ? "selected" : ""}`}
                                            onClick={() => handleSelectRecipient(user)}
                                            disabled={submitting || !hasAccount}
                                        >
                                            <h5>{user.fullName}</h5>
                                            <div className="recipient-option-meta">
                                                <p>Alias: {formatRecipientMeta(user)}</p>
                                            </div>
                                            {!hasAccount && (
                                                <span className="transfer-error">
                                                    Sin cuenta para recibir fondos
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {searchHint && (
                        <div className="transfer-hint">{searchHint}</div>
                    )}

                    {errors.recipient && (
                        <span className="transfer-error">{errors.recipient}</span>
                    )}

                    <div className="transfer-actions">
                        <button
                            type="button"
                            className="transfer-button transfer-button-secondary"
                            onClick={handleCancel}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="transfer-button transfer-button-primary"
                            onClick={handleContinueFromRecipient}
                            disabled={submitting || !hasRecipient}
                        >
                            Continuar
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="transfer-field">
                        <label htmlFor="amount">Monto</label>
                        <input
                            className="transfer-input"
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
                            <span className="transfer-error">{errors.amount}</span>
                        )}
                    </div>

                    <div className="transfer-field">
                        <label htmlFor="description">Descripción</label>
                        <input
                            className="transfer-input"
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Motivo de la transferencia"
                            value={description}
                            onChange={handleDescriptionChange}
                            disabled={submitting}
                        />
                    </div>

                    <div className="transfer-actions">
                        <button
                            type="button"
                            className="transfer-button transfer-button-secondary"
                            onClick={() => goToStep(1)}
                            disabled={submitting}
                        >
                            Volver
                        </button>
                        <button
                            type="button"
                            className="transfer-button transfer-button-primary"
                            onClick={handleContinueFromAmount}
                            disabled={submitting}
                        >
                            Continuar
                        </button>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <div className="transfer-summary">
                        <h2>Resumen de la transferencia</h2>
                        <dl>
                            <div>
                                <dt>Destinatario</dt>
                                <dd>
                                    {recipient?.fullName} ({recipient?.alias})
                                </dd>
                            </div>
                            <div>
                                <dt>Monto</dt>
                                <dd>{formatCurrency(parsedAmount)}</dd>
                            </div>
                            {description.trim() && (
                                <div>
                                    <dt>Descripción</dt>
                                    <dd>{description.trim()}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {serverError && (
                        <div className="transfer-banner transfer-banner-error">
                            {serverError}
                        </div>
                    )}

                    <div className="transfer-actions">
                        <button
                            type="button"
                            className="transfer-button transfer-button-secondary"
                            onClick={() => goToStep(2)}
                            disabled={submitting}
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            className="transfer-button transfer-button-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Enviando..." : "Confirmar"}
                        </button>
                    </div>
                </>
            )}
        </form>
    );
}

export default TransferForm;
