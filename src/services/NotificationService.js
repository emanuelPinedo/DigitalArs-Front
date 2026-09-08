import api from './api';

const NotificationService = {
    getMine: async () => {
        const response = await api.get('/notifications/me');
        return Array.isArray(response.data) ? response.data : [];
    },

    markRead: async (id) => {
        await api.patch(`/notifications/${id}/read`);
    },

    markAllRead: async () => {
        await api.post('/notifications/read-all');
    },
};

export default NotificationService;
