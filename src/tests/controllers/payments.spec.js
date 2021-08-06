import chai from 'chai';
const { expect } = chai;

import { BaseTest, mongodbURI } from '../index.spec';
import User from '../../models/Users'
import Clients from "../../models/Clients";
import Finance from "../../models/Finance";
import { user1, user3 } from '../__mocks__/users';
import {client1, client2} from "../__mocks__/clients";
import {loan1} from "../__mocks__/loans";
import {payment1, payment2} from "../__mocks__/payments";

const mongoose = require('mongoose');


describe('Test the payments feature', function (){
    let access_token;
    let secondClient;
    let id;
    let firstLoan;
    let loanId;
    let firstPayment;
    let paymentId;
    before('connect', function () {
        return mongoose.createConnection(mongodbURI)
    })

    afterEach(async function () {
        await User.deleteMany({})
        await Clients.deleteMany({})
        await Finance.deleteMany({})
    })

    beforeEach(async function () {
        const {userId, firstName, lastName, email, password} = user1
        const newUser = new User({
            userId,
            firstName,
            lastName,
            email,
            password
        });
        await newUser.save();

        const response = await BaseTest.post('auth/login').send({
            email: 'nserekopaul@gmail.com',
            password: 'P@ssw0rd',
        });
        access_token = response.body.token;
        secondClient = await BaseTest.post('client').set('Authorization', `${access_token}`).send(client2);
        firstLoan = await BaseTest.post('finance').set('Authorization', `${access_token}`).send(loan1);
        id = secondClient.body.client.clientId
        loanId = firstLoan.body.loan.loanId
        firstPayment = await BaseTest.post(`payment/${loanId}`).set('Authorization', `${access_token}`).send(payment1);
        paymentId = firstPayment.body.newPayment.paymentId
    });

    it('Should get all payments', async () => {
        const response = await BaseTest.get('payment').set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });

    it('Should get all payments for a loan', async () => {
        const response = await BaseTest.get(`payment/loans/${loanId}`).set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });

    it('Should get a single payment', async () => {
        const response = await BaseTest.get(`payment/${paymentId}`).set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });

    it('Should add a payment', async () => {
        const response = await BaseTest.post(`payment/${loanId}`).set('Authorization', `${access_token}`).send(payment2);
        expect(response.status).to.equal(201);
    });

})