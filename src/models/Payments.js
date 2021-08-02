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
    amount: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    datePaid: {
        type: String,
        required: true,
    },
});

let Payment = mongoose.model('payments', PaymentSchema);

export default Payment;
