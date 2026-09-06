import api from './api';

const AccountService = {
    getAll: async () => {
        const response = await api.get('/accounts');
        return response.data;
    },
};

export default AccountService;