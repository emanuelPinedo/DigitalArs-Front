import api from './api';

const login = async (email, password) => {
    const response = await api.post("auth/login", {
        email,
        password,
    });

    console.log("LOGIN RESPONSE:", response.data);
    
    return response.data;
};

export default {
    login,
};