import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Create Schema
const FinanceSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    client: {
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
});

let Finance = mongoose.model('finance', FinanceSchema);

export default Finance;
