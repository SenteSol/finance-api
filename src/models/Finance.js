import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Create Schema
const FinanceSchema = new Schema({
    loanId: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    managerEmail: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    rate: {
        type: String,
        required: true,
    },
    dateDisbursed: {
        type: String,
        required: true,
    },
    dateCleared: {
        type: String,
        required: false,
    },
    months: {
        type: Number,
        required: true,
    },
    interestAmount: {
        type: String,
        required: true,
    },
    totalOwed: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
});

let Finance = mongoose.model('finance', FinanceSchema);

export default Finance;
