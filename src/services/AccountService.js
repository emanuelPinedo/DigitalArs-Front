import api from './api';

const AccountService = {
    getAll: async () => {
        const response = await api.get('/accounts');
        return response.data;
    },

    deposit: async ({ amount }) => {
        const response = await api.post('accounts/deposit', { amount });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/accounts/me');
        return response.data;
    },
};

export default AccountService;