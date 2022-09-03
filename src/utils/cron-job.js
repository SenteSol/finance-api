import dayjs from 'dayjs';
// const cron = require('node-cron');
import cron from 'node-cron';
import Finance from '../models/Finance';
import { convertCurrencyToInteger, addCurrencySymbol } from './loans';

const checkLoans = (loans) =>
    loans.map(async (loan) => {
        const {
            loanId,
            pendingPrinciple,
            dateDisbursed,
            amount,
            rate,
            managerEmail,
            months,
            interestAmount,
            client,
            dateUpdated,
            totalOwed,
            dateCleared,
        } = loan;

        const lastDate = dayjs(dateUpdated);
        const today = dayjs(dayjs().format('YYYY-MM-DD'));
        const dateDifference = today.diff(lastDate, 'day');
        console.log(typeof dateDifference, 'the dayjs date diff ========>');

        if (dateDifference === 30 && !dateCleared) {
            const currency = convertCurrencyToInteger(
                pendingPrinciple || amount
            );
            const total = convertCurrencyToInteger(totalOwed);
            const principal = currency * 0.05 + total;

            const newPrincipal = addCurrencySymbol(amount, principal);
            const checkExistingLoan = await Finance.findOne({ loanId });

            const newLoan = {
                loanId,
                client,
                dateDisbursed,
                pendingPrinciple,
                dateUpdated: dayjs().format('YYYY-MM-DD'),
                amount,
                rate,
                interestAmount,
                managerEmail,
                months,
                totalOwed: newPrincipal,
            };
            await Object.assign(checkExistingLoan, newLoan);
            await checkExistingLoan.save();
            console.log(newLoan, 'saved the data =====>');
            return 'success';
        }
    });

export const runCron = () => {
    // runs everyday at 23:59
    // Update Loans at 11:59 PM every day.
    cron.schedule('59 23 * * *', async () => {
        const loans = await Finance.find().sort({ createdAt: -1 });
        return checkLoans(loans);
    });
};
