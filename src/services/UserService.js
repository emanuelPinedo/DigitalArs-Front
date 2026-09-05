import api from './api';

const searchByAlias = async (alias) => {
    const response = await api.get(
        `users/alias/${encodeURIComponent(alias)}`
    );

    return response.data;
};

export default {
    searchByAlias,
};
