import Payments from '../models/Payments';
import shortid from 'shortid';
import Finance from '../models/Finance';
import { convertCurrencyToInteger, getCurrencyPrice } from '../utils/loans';
import dayjs from 'dayjs';

class PaymentsController {
    static async getAllPayments(req, res) {
        const payments = await Payments.find().sort({ createdAt: -1 });
        if (payments.length === 0) {
            return res.status(200).json({
                message: 'There are no payments disbursed',
            });
        }
        res.json(payments);
    }
    static async getPaymentByLoanId(req, res) {
        const { loanId } = req.params;
        const loanPayments = await Payments.find({ loanId }).sort({
            createdAt: -1,
        });
        if (loanPayments.length === 0) {
            return res.status(200).json({
                message: 'There are no payments for this loan',
            });
        }
        res.json(loanPayments);
    }
    static async getPayment(req, res) {
        const { paymentId } = req.params;
        const payment = await Payments.findOne({ paymentId });
        if (payment.length === 0) {
            return res.status(200).json({
                message: 'This payment does not exist',
            });
        }
        res.json(payment);
    }
    static async makeLoanPayment(req, res) {
        const { loanId } = req.params;
        const { amount, comment, datePaid, currency } = req.body;
        const paymentId = shortid.generate();
        const loan = await Finance.findOne({ loanId: loanId });
        if (!loan) {
            return res.status(200).json({
                message: 'There are no loans disbursed with this id',
            });
        }

        const totalOwed = await convertCurrencyToInteger(loan.totalOwed);
        const loanAmount = await convertCurrencyToInteger(loan.amount);
        if (amount > totalOwed) {
            return res.status(400).json({
                message: `You cannot pay more than is owed, maximum payment is ${totalOwed}`,
            });
        }

        const amountPending = totalOwed - amount;
        const convertedAmount = getCurrencyPrice(currency, amountPending);

        const newPayment = new Payments({
            loanId: loan.loanId,
            paymentId,
            amountPaid: amount,
            comment,
            datePaid,
            previousPendingAmount: loan.totalOwed,
            amountPending: convertedAmount,
        });

        const newLoanAmount = {
            totalOwed: convertedAmount,
            pendingPrinciple:
                amountPending < loanAmount ? convertedAmount : loan.amount,
            comment: amountPending === 0 ? 'Loan closed' : loan.comment,
            dateUpdated: dayjs().format('YYYY-MM-DD'),
        };

        await Object.assign(loan, newLoanAmount);
        loan.save();
        await newPayment.save();

        res.status(201).json({
            newPayment,
            message: 'You have added a payment',
        });
    }

    static async deletePayment(req, res) {
        const { id } = req.params;
        const payment = await Payments.findOne({ paymentId: id });
        if (!payment) {
            return res.status(200).json({
                message: 'There are no loans disbursed with this id',
            });
        }
        await payment.remove();
        return res.status(204).json({});
    }
}

export default PaymentsController;
