import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Create Schema
const PaymentSchema = new Schema({
    loanId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    initialAmount: {
        type: String,
        required: false,
    },
    amountPaid: {
        type: String,
        required: true,
    },
    previousPendingAmount: {
        type: String,
        required: true,
    },
    amountPending: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
    datePaid: {
        type: String,
        required: true,
    },
});

let Payment = mongoose.model('payments', PaymentSchema);

export default Payment;
