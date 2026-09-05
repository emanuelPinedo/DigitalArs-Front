function getFieldErrors(errors) {
    if (!Array.isArray(errors)) {
        return [];
    }

    return errors
        .map((item) => item?.message)
        .filter(Boolean);
}

export function getApiErrorMessage(error, fallback) {
    const data = error?.response?.data;
    const status = error?.response?.status;

    if (typeof data?.message === 'string' && data.message.trim()) {
        return data.message;
    }

    const fieldMessages = getFieldErrors(data?.errors);
    if (fieldMessages.length > 0) {
        return fieldMessages.join('. ');
    }

    if (typeof data?.detail === 'string' && data.detail.trim()) {
        return data.detail;
    }

    if (typeof data?.title === 'string' && data.title.trim()) {
        return data.title;
    }

    if (!error?.response) {
        return 'No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.';
    }

    if (status === 400) {
        return 'No se pudo completar la operación. Revisá el monto y el destinatario.';
    }

    if (status === 404) {
        return 'No encontramos el destinatario o la cuenta indicada.';
    }

    return fallback || 'Ocurrió un error inesperado. Intentá de nuevo.';
}
