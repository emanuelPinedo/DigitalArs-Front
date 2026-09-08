import { createContext, useCallback, useMemo, useRef, useState } from "react";
import ToastContainer from "../components/ToastContainer";

const ToastContext = createContext();

const DURATIONS = {
    success: 4000,
    error: 6000,
};

let nextToastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timeoutsRef = useRef(new Map());

    const removeToast = useCallback((id) => {
        const timeoutId = timeoutsRef.current.get(id);

        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutsRef.current.delete(id);
        }

        setToasts((current) => current.filter((item) => item.id !== id));
    }, []);

    const addToast = useCallback(
        (type, message) => {
            const text = String(message ?? "").trim();

            if (!text) {
                return;
            }

            const id = ++nextToastId;
            const duration = DURATIONS[type] ?? DURATIONS.success;

            setToasts((current) => [...current, { id, type, message: text }]);

            const timeoutId = setTimeout(() => {
                removeToast(id);
            }, duration);

            timeoutsRef.current.set(id, timeoutId);
        },
        [removeToast]
    );

    const toast = useMemo(
        () => ({
            success: (message) => addToast("success", message),
            error: (message) => addToast("error", message),
        }),
        [addToast]
    );

    const value = useMemo(
        () => ({ toast }),
        [toast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

export default ToastContext;
