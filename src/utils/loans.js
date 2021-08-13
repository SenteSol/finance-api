import Dinero from 'dinero.js';
import dayjs from 'dayjs';

export const getCurrencyPrice = (storeKey, amount) => {
    const price = Math.round(amount * 100);
    switch (storeKey?.toUpperCase()) {
        case 'USD':
            return Dinero({
                amount: price,
                currency: 'USD',
                precision: 2,
            }).toFormat();
        case 'UGX':
            return Dinero({
                amount: price,
                currency: 'UGX',
                precision: 2,
            }).toFormat();
        default:
            return Dinero({
                amount: price,
                currency: 'EUR',
                precision: 2,
            }).toFormat();
    }
};

const calculateLoanMonth = dateDisbursed => {
    const cleaned = dateDisbursed.split('-');
    const loanYear = parseInt(cleaned[0]);
    const loanMonth = parseInt(cleaned[1]);
    const loanDate = parseInt(cleaned[2]);
    return new Date(loanYear, loanMonth, loanDate);
};

const calculateCurrentMonth = () => {
    const currentDate = dayjs(Date.now()).format('YYYY-MM-DD');
    const cleaned = currentDate.split('-');
    const loanYear = parseInt(cleaned[0]);
    const loanMonth = parseInt(cleaned[1]);
    const loanDate = parseInt(cleaned[2]);
    return new Date(loanYear, loanMonth, loanDate);
};

export const calculateMonths = dateDisbursed => {
    const dt1 = calculateLoanMonth(dateDisbursed);
    const dt2 = calculateCurrentMonth();
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    const months = Math.round((diff /= 60 * 60 * 24 * 7 * 4));
    if (months === 0) {
        return Math.abs(months);
    }
    return Math.abs(months) - 1;
};

export const calculateEarnings = (months, amount, rate) => {
    const interestEarned = months * (amount * (rate / 100));
    const totalEarned = amount + interestEarned;
    return { interestEarned, totalEarned };
};

export const convertCurrencyToInteger = amount => {
    if (amount.includes('UGX')) {
        return parseInt(
            amount
                .replaceAll(',', '')
                .replace('.', '')
                .split('')
                .slice(4, -2)
                .join(''),
            10
        );
    }
    if (amount.includes('$')) {
        return parseInt(
            amount
                .replace(',', '')
                .replace('.', '')
                .split('')
                .slice(1, -2)
                .join(''),
            10
        );
    }
    return parseInt(
        amount
            .replaceAll(',', '')
            .replace('.', '')
            .split('')
            .slice(1, -2)
            .join(''),
        10
    );
};
