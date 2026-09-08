import "../styles/components/toast.scss";

function ToastContainer({ toasts = [], onDismiss }) {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map((item) => {
                const isError = item.type === "error";

                return (
                    <div
                        key={item.id}
                        className={`toast toast-${item.type}`}
                        role={isError ? "alert" : "status"}
                    >
                        <p className="toast-message">{item.message}</p>
                        <button
                            type="button"
                            className="toast-close"
                            onClick={() => onDismiss(item.id)}
                            aria-label="Cerrar mensaje"
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default ToastContainer;
