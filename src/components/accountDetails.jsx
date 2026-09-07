import useAuth from "../hooks/useAuth";
import "../styles/pages/deposit.scss";

function AccountDetails() {
    const { user } = useAuth();

    const fields = [
        { label: "Alias", value: user?.alias },
        { label: "CVU", value: user?.cvu },
        { label: "Titular", value: user?.fullName },
        { label: "DNI", value: user?.dni },
    ];

    function handleCopy() {
        const text = `Alias: ${user?.alias}\n\
        CVU: ${user?.cvu}\n\
        Titular: ${user?.fullName}\n\
        DNI: ${user?.dni}`;
        navigator.clipboard.writeText(text);
    }

    return (
        <div className="account-details">
            <p className="account-details-hint">
                Copiá estos datos en tu home banking. La cuenta está a tu nombre.
            </p>

            <dl className="account-details-list">
                {fields.map((field) => (
                    <div className="account-details-row" key={field.label}>
                        <dt>{field.label}</dt>
                        <dd>{field.value ?? "—"}</dd>
                    </div>
                ))}
            </dl>

            <button
                type="button"
                className="transfer-button transfer-button-primary"
                onClick={handleCopy}
            >
                Copiar datos
            </button>
        </div>
    );
}

export default AccountDetails;