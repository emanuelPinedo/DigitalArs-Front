import api from './api';

const FALLBACK_ANNUAL_RATE = 0.3;

function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function roundMoney(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function toRatePercent(rate) {
    const parsed = toNumber(rate);
    const value = parsed == null || parsed <= 0 ? FALLBACK_ANNUAL_RATE : parsed;

    return value <= 1 ? value * 100 : value;
}

function toRateDecimal(rate) {
    return toRatePercent(rate) / 100;
}

function pickNumber(item, ...keys) {
    for (const key of keys) {
        const value = toNumber(item?.[key]);
        if (value != null) {
            return value;
        }
    }

    return null;
}

function pickDate(item, ...keys) {
    for (const key of keys) {
        const value = item?.[key];
        if (value) {
            return value;
        }
    }

    return null;
}

function startOfDay(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    date.setHours(0, 0, 0, 0);
    return date;
}

function daysBetween(from, to) {
    const start = startOfDay(from);
    const end = startOfDay(to);

    if (!start || !end) {
        return null;
    }

    return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

function addDays(value, days) {
    const date = startOfDay(value);

    if (!date || days == null) {
        return null;
    }

    date.setDate(date.getDate() + days);
    return date.toISOString();
}

function estimateInterest({ amount, termDays, annualRate }) {
    const principal = toNumber(amount) ?? 0;
    const days = toNumber(termDays) ?? 0;
    const interestAmount = roundMoney(
        principal * toRateDecimal(annualRate) * (days / 365)
    );

    return {
        interestAmount,
        finalAmount: roundMoney(principal + interestAmount),
    };
}

function normalizeDeposit(item, index) {
    const amount = pickNumber(item, 'amount', 'Amount') ?? 0;
    const annualRate = pickNumber(item, 'annualRate', 'AnnualRate');
    const maturityDate = pickDate(item, 'maturityDate', 'MaturityDate');
    let createdAt = pickDate(item, 'createdAt', 'CreatedAt', 'startDate', 'StartDate');
    let termDays = pickNumber(item, 'termDays', 'TermDays', 'days', 'Days');
    let interestAmount = pickNumber(item, 'interestAmount', 'InterestAmount', 'interest');
    let finalAmount = pickNumber(item, 'finalAmount', 'FinalAmount');

    if (termDays == null && createdAt && maturityDate) {
        termDays = daysBetween(createdAt, maturityDate);
    }

    if (termDays == null && maturityDate) {
        const remainingDays = daysBetween(new Date(), maturityDate);
        if (remainingDays != null && remainingDays > 0) {
            termDays = remainingDays;
        }
    }

    if (!createdAt && maturityDate && termDays != null) {
        createdAt = addDays(maturityDate, -termDays);
    }

    if ((interestAmount == null || finalAmount == null) && termDays != null) {
        const estimated = estimateInterest({ amount, termDays, annualRate });
        interestAmount = interestAmount ?? estimated.interestAmount;
        finalAmount = finalAmount ?? estimated.finalAmount;
    }

    return {
        id: item?.id ?? item?.Id ?? `${maturityDate ?? 'deposit'}-${amount}-${index}`,
        amount,
        annualRate,
        termDays,
        interestAmount,
        finalAmount,
        createdAt,
        maturityDate,
        status: item?.status ?? item?.Status,
    };
}

const create = async ({ amount, termDays }) => {
    const response = await api.post('fixed-deposits', {
        amount,
        termDays,
    });

    return normalizeDeposit(response.data, 0);
};

const getMine = async () => {
    const response = await api.get('fixed-deposits/me');
    const data = response.data;
    const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
            ? data.items
            : [];

    return items.map(normalizeDeposit);
};

export default {
    FALLBACK_ANNUAL_RATE,
    create,
    getMine,
    toRatePercent,
    toRateDecimal,
    estimateInterest,
};
