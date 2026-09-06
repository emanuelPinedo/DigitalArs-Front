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

const getMine = async ({
    page,
    pageSize,
    type,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
} = {}) => {
    const params = {};

    if (page != null) {
        params.Page = page;
    }

    if (pageSize != null) {
        params.PageSize = pageSize;
    }

    if (type) {
        params.Type = type;
    }

    if (fromDate) {
        params.FromDate = fromDate;
    }

    if (toDate) {
        params.ToDate = toDate;
    }

    if (minAmount !== '' && minAmount != null) {
        params.MinAmount = minAmount;
    }

    if (maxAmount !== '' && maxAmount != null) {
        params.MaxAmount = maxAmount;
    }

    const response = await api.get('transactions/me', { params });

    return response.data;
};

export default {
    transfer,
    getMine,
};
