import { useEffect, useState } from "react";
import Card from "../components/Card";
import AccountService from "../services/AccountService";
import UserService from "../services/UserService";
import useRealtime from "../hooks/useRealtime";
import useToast from "../hooks/useToast";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/deposit.scss";

const STEPS = [
    { id: 1, label: "Importe" },
    { id: 2, label: "Confirmación" },
];


function parseAmount(value) {
    const raw = String(value).trim().replace(/\$/g, "").replace(/\s/g, "");

    if (!raw) {
        return NaN;
    }

    const hasComma = raw.includes(",");
    const hasDot = raw.includes(".");
    let normalized = raw;

    if (hasComma && hasDot) {
        if (raw.lastIndexOf(",") > raw.lastIndexOf(".")) {
            normalized = raw.replace(/\./g, "").replace(",", ".");
        } else {
            normalized = raw.replace(/,/g, "");
        }
    } else if (hasComma) {
        normalized = raw.replace(",", ".");
    }

    return Number(normalized);
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
}

function buildCopyText({ alias, titular, dni }) {
    const lines = [];

    if (alias) {
        lines.push(`Alias: ${alias}`);
    }

    if (titular) {
        lines.push(`Titular: ${titular}`);
    }

    if (dni) {
        lines.push(`DNI: ${dni}`);
    }

    return lines.join("\n");
}

function Deposit() {
    const { refreshAccount } = useRealtime();
    const { toast } = useToast();

    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [detailsError, setDetailsError] = useState("");
    const [copyStatus, setCopyStatus] = useState({ type: "", message: "" });

    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");
    const [confirmedAmount, setConfirmedAmount] = useState(null);
    const [amountError, setAmountError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadDetails = async () => {
            try {
                setDetailsLoading(true);
                setDetailsError("");

                const [profileResult, accountResult] = await Promise.allSettled([
                    UserService.getMe(),
                    AccountService.getMe(),
                ]);

                if (cancelled) {
                    return;
                }

                if (profileResult.status === "fulfilled") {
                    setProfile(profileResult.value);
                } else {
                    setProfile(null);
                    setDetailsError(
                        getApiErrorMessage(
                            profileResult.reason,
                            "No pudimos cargar los datos de tu cuenta."
                        )
                    );
                }

                if (accountResult.status === "fulfilled") {
                    setAccount(accountResult.value);
                } else {
                    setAccount(null);
                }
            } finally {
                if (!cancelled) {
                    setDetailsLoading(false);
                }
            }
        };

        loadDetails();

        return () => {
            cancelled = true;
        };
    }, []);

    const alias = profile?.alias || "";
    const titular = profile?.fullName || "";
    const dni = profile?.dni || "";
    const copyText = buildCopyText({ alias, titular, dni });

    const parsedAmount = parseAmount(amount);
    const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
    const amountToConfirm =
        Number.isFinite(confirmedAmount) && confirmedAmount > 0
            ? confirmedAmount
            : parsedAmount;
    const isConfirmStep = Number(step) === 2;

    const resetForm = () => {
        setStep(1);
        setAmount("");
        setConfirmedAmount(null);
        setAmountError("");
    };

    const handleCopy = async () => {
        if (!copyText) {
            return;
        }

        try {
            await navigator.clipboard.writeText(copyText);
            setCopyStatus({ type: "success", message: "Datos copiados." });
        } catch {
            setCopyStatus({
                type: "error",
                message: "No se pudieron copiar los datos.",
            });
        }
    };

    const handleContinue = () => {
        if (!hasValidAmount) {
            setAmountError("El monto debe ser mayor a 0.");
            return;
        }

        setAmountError("");
        setConfirmedAmount(parsedAmount);
        setStep(2);
    };

    const handleConfirm = async (event) => {
        event.preventDefault();

        if (!isConfirmStep || !Number.isFinite(amountToConfirm) || amountToConfirm <= 0) {
            return;
        }

        try {
            setSubmitting(true);

            await AccountService.deposit({ amount: amountToConfirm });
            await refreshAccount();

            toast.success(
                `Depósito de ${formatCurrency(amountToConfirm)} acreditado.`
            );
            resetForm();
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "No se pudo completar el depósito. Intentá de nuevo."
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="deposit-page">
            <div className="deposit-layout">
                <Card
                    titleName="Nuevo depósito"
                    className="deposit-form-card"
                >
                    <form className="deposit-form" onSubmit={handleConfirm}>
                        <nav className="deposit-steps" aria-label="Pasos del depósito">
                            {STEPS.map((item) => {
                                const isActive = Number(step) === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`deposit-step ${isActive ? "active" : ""}`}
                                        disabled={
                                            submitting ||
                                            (item.id === 2 &&
                                                !(
                                                    Number.isFinite(amountToConfirm) &&
                                                    amountToConfirm > 0
                                                ))
                                        }
                                        onClick={() => {
                                            if (item.id === 2 && !amountToConfirm) {
                                                return;
                                            }

                                            setAmountError("");
                                            setStep(item.id);
                                        }}
                                    >
                                        {item.id} {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {isConfirmStep ? (
                            <>
                                <section
                                    className="deposit-summary"
                                    aria-label="Resumen del depósito"
                                >
                                    <p className="deposit-summary-caption">
                                        Revisá los datos antes de acreditar el
                                        dinero en tu cuenta.
                                    </p>
                                    <p className="deposit-summary-amount">
                                        {Number.isFinite(amountToConfirm) &&
                                        amountToConfirm > 0
                                            ? formatCurrency(amountToConfirm)
                                            : "—"}
                                    </p>
                                    <p className="deposit-summary-amount-label">
                                        Monto a acreditar
                                    </p>

                                    <div className="deposit-summary-rows">
                                        <div>
                                            <span>Tipo</span>
                                            <strong>Depósito</strong>
                                        </div>
                                        <div>
                                            <span>Destino</span>
                                            <strong>Tu cuenta DigitalArs</strong>
                                        </div>
                                        <div>
                                            <span>Alias</span>
                                            <strong className="deposit-details-alias">
                                                {alias || "—"}
                                            </strong>
                                        </div>
                                        <div>
                                            <span>Titular</span>
                                            <strong>{titular || "—"}</strong>
                                        </div>
                                    </div>
                                </section>

                                <div className="deposit-actions">
                                    <button
                                        type="button"
                                        className="deposit-button deposit-button-secondary"
                                        onClick={() => setStep(1)}
                                        disabled={submitting}
                                    >
                                        Volver
                                    </button>
                                    <button
                                        type="submit"
                                        className="deposit-button deposit-button-primary"
                                        disabled={
                                            submitting ||
                                            !Number.isFinite(amountToConfirm) ||
                                            amountToConfirm <= 0
                                        }
                                    >
                                        {submitting ? "Confirmando..." : "Confirmar"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="deposit-field">
                                    <label htmlFor="amount">Monto</label>
                                    <input
                                        className="deposit-input"
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        inputMode="decimal"
                                        placeholder="0,00"
                                        value={amount}
                                        onChange={(event) => {
                                            setAmount(event.target.value);
                                            setAmountError("");
                                        }}
                                        disabled={submitting}
                                        autoComplete="off"
                                    />
                                    {amountError ? (
                                        <span className="deposit-error">
                                            {amountError}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="deposit-actions">
                                    <button
                                        type="button"
                                        className="deposit-button deposit-button-secondary"
                                        onClick={resetForm}
                                        disabled={submitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="deposit-button deposit-button-primary"
                                        onClick={handleContinue}
                                        disabled={submitting}
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </Card>

                <Card
                    titleName="Datos de tu cuenta"
                    className="deposit-details-card"
                >
                    <p className="deposit-details-caption">
                        Copiá estos datos en tu home banking. La cuenta está a
                        tu nombre.
                    </p>

                    {detailsLoading ? (
                        <p className="deposit-details-status">Cargando...</p>
                    ) : detailsError ? (
                        <p className="deposit-details-error">{detailsError}</p>
                    ) : (
                        <>
                            <dl className="deposit-details-list">
                                <div>
                                    <dt>Alias</dt>
                                    <dd className="deposit-details-alias">
                                        {alias || "—"}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Titular</dt>
                                    <dd>{titular || "—"}</dd>
                                </div>
                                <div>
                                    <dt>DNI</dt>
                                    <dd>{dni || "—"}</dd>
                                </div>
                            </dl>

                            <button
                                type="button"
                                className="deposit-button deposit-button-primary"
                                onClick={handleCopy}
                                disabled={!copyText}
                            >
                                Copiar datos
                            </button>

                            {copyStatus.message ? (
                                <p
                                    className={`deposit-details-copy-status ${copyStatus.type}`}
                                    role="status"
                                >
                                    {copyStatus.message}
                                </p>
                            ) : null}
                        </>
                    )}
                </Card>
            </div>
        </main>
    );
}

export default Deposit;
