import { useEffect, useState } from "react";
import Card from "../components/Card";
import DepositForm from "../components/DepositForm";
import api from "../services/api";
import UserService from "../services/UserService";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/pages/deposit.scss";

function getAccountCvu(account) {
    return account?.cvu || account?.cbu || account?.CVU || account?.CBU || "";
}

function buildCopyText({ alias, cvu, titular, dni }) {
    const lines = [];

    if (alias) {
        lines.push(`Alias: ${alias}`);
    }

    if (cvu) {
        lines.push(`CVU: ${cvu}`);
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
    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [detailsError, setDetailsError] = useState("");
    const [copyStatus, setCopyStatus] = useState({ type: "", message: "" });

    useEffect(() => {
        let cancelled = false;

        const loadDetails = async () => {
            try {
                setDetailsLoading(true);
                setDetailsError("");

                const [profileResult, accountResult] = await Promise.allSettled([
                    UserService.getMe(),
                    api.get("accounts/me"),
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
                    setAccount(accountResult.value.data);
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
    const cvu = getAccountCvu(account);
    const copyText = buildCopyText({ alias, cvu, titular, dni });

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

    return (
        <main className="deposit-page">
            <div className="deposit-layout">
                <Card
                    titleName="Nuevo depósito"
                    className="deposit-form-card"
                >
                    <DepositForm />
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

                            {copyStatus.message && (
                                <p
                                    className={`deposit-details-copy-status ${copyStatus.type}`}
                                    role="status"
                                >
                                    {copyStatus.message}
                                </p>
                            )}
                        </>
                    )}
                </Card>
            </div>
        </main>
    );
}

export default Deposit;
