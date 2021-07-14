import chai from 'chai';
const { expect } = chai;

import { BaseTest, mongodbURI } from '../index.spec';
import User from '../../models/Users'
import Clients from "../../models/Clients";
import Finance from "../../models/Finance";
import { user1, user3 } from '../__mocks__/users';
import {client1, client2} from "../__mocks__/clients";
import {loan1} from "../__mocks__/loans";

const mongoose = require('mongoose');


describe('Test the loans feature', function() {
    let access_token;
    let secondClient;
    let id;
    let firstLoan;
    let loanId;
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
    });

    it('Should get all loans', async () => {
        const response = await BaseTest.get('finance').set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });

    it('Should get all loans by manager', async () => {
        const response = await BaseTest.get('finance/manager/email').set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });

    it('Should create a loan', async () => {
        const response = await BaseTest.post('finance').set('Authorization', `${access_token}`).send(loan1);
        expect(response.status).to.equal(201);
    });
    it('Should get a loan by id', async () => {
        const response = await BaseTest.get(`finance/${loanId}`).set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });
    it('Should edit a loan', async () => {
        const response = await BaseTest.put(`finance/${loanId}`).set('Authorization', `${access_token}`).send({currency: "eur"});
        expect(response.status).to.equal(201);
    });

})

