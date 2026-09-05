import api from './api';

const searchByAlias = async (alias) => {
    const response = await api.get(
        `users/alias/${encodeURIComponent(alias)}`
    );

    return response.data;
};

const getAll = async ({
    page = 1,
    pageSize = 10,
    name,
    email,
    roleId,
    isActive,
} = {}) => {
    const params = {
        Page: page,
        PageSize: pageSize,
    };

    if (name?.trim()) {
        params.Name = name.trim();
    }

    if (email?.trim()) {
        params.Email = email.trim();
    }

    if (roleId !== '' && roleId != null) {
        params.RoleId = roleId;
    }

    if (isActive !== '' && isActive != null) {
        params.IsActive = isActive;
    }

    const response = await api.get('users', { params });

    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`users/${id}`);

    return response.data;
};

const create = async (user) => {
    const response = await api.post('users', user);

    return response.data;
};

const update = async (id, user) => {
    await api.put(`users/${id}`, user);
};

const remove = async (id) => {
    await api.delete(`users/${id}`);
};

export default {
    searchByAlias,
    getAll,
    getById,
    create,
    update,
    remove,
};