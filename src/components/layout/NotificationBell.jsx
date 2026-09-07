import { useEffect, useRef, useState } from "react";
import useRealtime from "../../hooks/useRealtime";
import bellIcon from "../../assets/images/icons/bell.svg?raw";

function formatNotificationTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const time = new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);

    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
        return `Hoy, ${time}`;
    }

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function NotificationBell() {
    const {
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        lastEvent,
    } = useRealtime();
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const liveMessage = lastEvent?.message || lastEvent?.Message || lastEvent?.title || lastEvent?.Title || '';

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const handleToggle = () => {
        setOpen((current) => !current);
    };

    const handleItemClick = (notification) => {
        if (!notification.isRead) {
            markRead(notification.id);
        }
    };

    return (
        <div className="notification-bell" ref={rootRef}>
            <button
                type="button"
                className="theme-toggle notification-bell-button"
                onClick={handleToggle}
                aria-label={
                    unreadCount > 0
                        ? `Notificaciones, ${unreadCount} sin leer`
                        : "Notificaciones"
                }
                aria-expanded={open}
                aria-haspopup="true"
            >
                <span
                    className="notification-bell-icon"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: bellIcon }}
                />
                {unreadCount > 0 ? (
                    <span className="notification-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                ) : null}
            </button>

            <p className="visually-hidden" role="status" aria-live="polite">
                {liveMessage}
            </p>

            {open ? (
                <div className="notification-panel" role="menu">
                    <div className="notification-panel-header">
                        <strong>Notificaciones</strong>
                        {unreadCount > 0 ? (
                            <button
                                type="button"
                                className="notification-mark-all"
                                onClick={markAllRead}
                            >
                                Marcar todas como leídas
                            </button>
                        ) : null}
                    </div>

                    {notifications.length === 0 ? (
                        <p className="notification-empty">
                            No tenés movimientos recientes.
                        </p>
                    ) : (
                        <ul className="notification-list">
                            {notifications.map((notification) => (
                                <li key={notification.id}>
                                    <button
                                        type="button"
                                        className={`notification-item${
                                            notification.isRead ? "" : " unread"
                                        }`}
                                        onClick={() => handleItemClick(notification)}
                                    >
                                        <span className="notification-item-title">
                                            {notification.title}
                                        </span>
                                        <span className="notification-item-message">
                                            {notification.message}
                                        </span>
                                        <span className="notification-item-time">
                                            {formatNotificationTime(
                                                notification.createdAt
                                            )}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : null}
        </div>
    );
}

export default NotificationBell;
