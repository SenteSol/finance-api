import Finance from '../models/Finance';
import shortid from 'shortid';
import {
    getCurrencyPrice,
    calculateMonths,
    calculateEarnings,
} from '../utils/loans';
import dayjs from 'dayjs';

class FinanceController {
    static async getAllLoans(req, res) {
        const loans = await Finance.find().sort({ createdAt: -1 });
        if (loans.length === 0) {
            return res.status(200).json({
                message: 'There are no loans disbursed',
            });
        }
        res.json(loans);
    }

    static async getLoan(req, res) {
        const { id } = req.params;
        const loan = await Finance.findOne({ clientId: id });
        if (!loan) {
            return res.status(200).json({
                message: 'There are no loans disbursed with this id',
            });
        }
        res.json(loan);
    }

    static async addLoan(req, res) {
        const { client, amount, rate, dateDisbursed, currency } = req.body;
        const clientId = shortid.generate();
        const loanAmount = await getCurrencyPrice(currency, amount);
        const interest = rate.toString() + '%';
        const isBefore = dayjs(dateDisbursed).isBefore(dayjs(new Date()));
        if (!isBefore) {
            return res.status(400).json({
                message: 'Invalid date, please check the provided date',
            });
        }
        const getMonthsDifference = await calculateMonths(dateDisbursed);

        const { interestEarned, totalEarned } = calculateEarnings(
            getMonthsDifference,
            amount,
            rate
        );
        const totalInterest = await getCurrencyPrice(currency, interestEarned);
        const amountPayable = await getCurrencyPrice(currency, totalEarned);

        const newLoan = new Finance({
            clientId,
            client,
            amount: loanAmount,
            rate: interest,
            dateDisbursed,
            months: getMonthsDifference,
            interestAmount: totalInterest,
            totalOwed: amountPayable,
        });

        const loan = await newLoan.save();
        res.status(201).json({
            loan,
            message: 'You have  added a new loan',
        });
    }

    static async updateLoan(req, res) {
        const { client, amount, rate, dateDisbursed, currency } = req.body;
        const { id } = req.params;
        const loan = await Finance.findOne({ clientId: id });
        if (!loan) {
            return res.status(200).json({
                message: 'There are no loans disbursed with this id',
            });
        }
        const loanAmount =
            currency && amount
                ? await getCurrencyPrice(currency, amount)
                : undefined;
        const interest = rate ? rate.toString() + '%' : undefined;
        const isBefore = dateDisbursed
            ? dayjs(dateDisbursed).isBefore(dayjs(new Date()))
            : loan.dateDisbursed;
        if (!isBefore) {
            return res.status(400).json({
                message: 'Invalid date, please check the provided date',
            });
        }
        const getMonthsDifference = dateDisbursed
            ? await calculateMonths(dateDisbursed)
            : undefined;

        const { interestEarned, totalEarned } =
            getMonthsDifference && amount && rate
                ? calculateEarnings(getMonthsDifference, amount, rate)
                : {
                      interestEarned: undefined,
                      totalEarned: undefined,
                  };
        const totalInterest =
            currency && interestEarned
                ? await getCurrencyPrice(currency, interestEarned)
                : undefined;
        const amountPayable =
            currency && totalEarned
                ? await getCurrencyPrice(currency, totalEarned)
                : undefined;
        if (loan) {
            const newLoan = {
                client: client ?? loan.client,
                amount: loanAmount ?? loan.amount,
                rate: interest ?? loan.rate,
                dateDisbursed: dateDisbursed ?? loan.dateDisbursed,
                months: getMonthsDifference ?? loan.months,
                interestAmount: totalInterest ?? loan.interestAmount,
                totalOwed: amountPayable ?? loan.totalOwed,
            };
            return res.status(201).json({ message: newLoan });
        }
    }

    static async deleteLoan(req, res) {
        const { id } = req.params;
        const loan = await Finance.findOne({ clientId: id });
        if (!loan) {
            return res.status(200).json({
                message: 'There are no loans disbursed with this id',
            });
        }
        await loan.remove();
        return res.status(204).json({});
    }
}

export default FinanceController;