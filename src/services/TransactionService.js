import api from './api';

const transfer = async ({ destinationAccountId, amount, description }) => {
    const payload = {
        destinationAccountId,
        amount,
    };

    if (description?.trim()) {
        payload.description = description.trim();
    }

    const response = await api.post('transactions/transfer', payload);

    return response.data;
};

export default {
    transfer,
};
