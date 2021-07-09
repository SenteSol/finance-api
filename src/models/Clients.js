import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Create Schema
const ClientSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    managerEmail: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    clientContactEmail: {
        type: String,
        required: true,
    },
    clientContactNumber: {
        type: String,
        required: true,
    },
});

let Clients = mongoose.model('client', ClientSchema);

export default Clients;
