export function getHubUrl() {
    const apiUrl = import.meta.env.VITE_API_URL || '/api/';
    const origin = String(apiUrl).replace(/\/?api\/?$/i, '');
    return `${origin}/hubs/account`.replace(/([^:]\/)\/+/g, '$1');
}

export function getAccountBalance(account) {
    if (!account) {
        return null;
    }

    const value = account.balance ?? account.availableBalance ?? account.price;

    return Number.isFinite(Number(value)) ? Number(value) : null;
}

export function mapRealtimeNotification(event) {
    return {
        id: event.notificationId ?? event.NotificationId,
        type: event.type ?? event.Type,
        title: event.title ?? event.Title,
        message: event.message ?? event.Message,
        amount: event.amount ?? event.Amount,
        isRead: false,
        createdAt: event.occurredAt ?? event.OccurredAt,
    };
}
