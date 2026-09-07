import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import AccountService from '../services/AccountService';
import NotificationService from '../services/NotificationService';
import useAuth from '../hooks/useAuth';
import {
    getAccountBalance,
    getHubUrl,
    mapRealtimeNotification,
} from '../utils/realtime';
import { getApiErrorMessage } from '../utils/apiError';

const RealtimeContext = createContext(null);

export function RealtimeProvider({ children }) {
    const { token, isAuthenticated } = useAuth();
    const connectionRef = useRef(null);

    const [account, setAccount] = useState(null);
    const [accountLoading, setAccountLoading] = useState(true);
    const [accountError, setAccountError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [lastEvent, setLastEvent] = useState(null);
    const [lastUpdatedAt, setLastUpdatedAt] = useState(0);

    const applyAccountEvent = useCallback((event) => {
        if (!event) {
            return;
        }

        setAccount((previous) => ({
            ...(previous ?? {}),
            price: event.balance ?? event.Balance,
            balance: event.balance ?? event.Balance,
        }));

        const incoming = mapRealtimeNotification(event);
        setNotifications((previous) => {
            if (previous.some((item) => item.id === incoming.id)) {
                return previous;
            }

            return [incoming, ...previous];
        });

        setLastEvent(event);
        setLastUpdatedAt(Date.now());
    }, []);

    const refreshAccount = useCallback(async () => {
        try {
            setAccountLoading(true);
            setAccountError('');
            const data = await AccountService.getMe();
            setAccount(data);
        } catch (error) {
            setAccount(null);
            setAccountError(
                getApiErrorMessage(error, 'No pudimos cargar tu saldo.')
            );
        } finally {
            setAccountLoading(false);
        }
    }, []);

    const refreshNotifications = useCallback(async () => {
        try {
            const items = await NotificationService.getMine();
            setNotifications(items);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const markRead = useCallback(async (id) => {
        setNotifications((previous) =>
            previous.map((item) =>
                item.id === id ? { ...item, isRead: true } : item
            )
        );

        try {
            await NotificationService.markRead(id);
        } catch (error) {
            console.error(error);
            await refreshNotifications();
        }
    }, [refreshNotifications]);

    const markAllRead = useCallback(async () => {
        setNotifications((previous) =>
            previous.map((item) => ({ ...item, isRead: true }))
        );

        try {
            await NotificationService.markAllRead();
        } catch (error) {
            console.error(error);
            await refreshNotifications();
        }
    }, [refreshNotifications]);

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

        let cancelled = false;

        (async () => {
            try {
                const [accountData, notificationItems] = await Promise.all([
                    AccountService.getMe(),
                    NotificationService.getMine().catch((error) => {
                        console.error(error);
                        return [];
                    }),
                ]);

                if (cancelled) {
                    return;
                }

                setAccount(accountData);
                setNotifications(notificationItems);
                setAccountError('');
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setAccount(null);
                setAccountError(
                    getApiErrorMessage(error, 'No pudimos cargar tu saldo.')
                );
            } finally {
                if (!cancelled) {
                    setAccountLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            return undefined;
        }

        let cancelled = false;
        let connection;

        const connect = async () => {
            if (cancelled) {
                return;
            }

            connection = new HubConnectionBuilder()
                .withUrl(getHubUrl(), {
                    accessTokenFactory: () => localStorage.getItem('token') || token,
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Warning)
                .build();

            connection.on('AccountUpdated', applyAccountEvent);
            connectionRef.current = connection;

            try {
                await connection.start();

                if (cancelled) {
                    await connection.stop();
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error('No se pudo conectar al hub de cuenta.', error);
            }
        };

        // Strict Mode monta, desmonta y vuelve a montar en el mismo tick.
        // Diferir el start evita abortar la negociación del primer ciclo.
        const timeoutId = window.setTimeout(connect, 0);

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);

            connection?.off('AccountUpdated', applyAccountEvent);

            if (connectionRef.current === connection) {
                connectionRef.current = null;
            }

            if (connection && connection.state !== HubConnectionState.Disconnected) {
                connection.stop().catch(() => {});
            }
        };
    }, [applyAccountEvent, isAuthenticated, token]);

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.isRead).length,
        [notifications]
    );

    const balance = getAccountBalance(account);

    const value = useMemo(
        () => ({
            account,
            balance,
            accountLoading,
            accountError,
            refreshAccount,
            notifications,
            unreadCount,
            markRead,
            markAllRead,
            lastEvent,
            lastUpdatedAt,
        }),
        [
            account,
            accountError,
            accountLoading,
            balance,
            lastEvent,
            lastUpdatedAt,
            markAllRead,
            markRead,
            notifications,
            refreshAccount,
            unreadCount,
        ]
    );

    return (
        <RealtimeContext.Provider value={value}>
            {children}
        </RealtimeContext.Provider>
    );
}

export default RealtimeContext;
