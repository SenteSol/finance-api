import chai from 'chai';
const { expect } = chai;

import { BaseTest, mongodbURI } from '../index.spec';
import User from '../../models/Users'
import Clients from "../../models/Clients";
import { user1, user3 } from '../__mocks__/users';
import {client1, client2} from "../__mocks__/clients";
const mongoose = require('mongoose');//tell mongoose to use es6 implementation of promises

describe('Test the clients feature', function() {
    let access_token;
    let secondClient;
    let id;
    before('connect', function () {
        return mongoose.createConnection(mongodbURI)
    })

    afterEach(async function () {
        await User.deleteMany({})
        await Clients.deleteMany({})
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
        id = secondClient.body.client.clientId
    });

    it('Should get all clients', async () => {
        const response = await BaseTest.get('client').set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });
    it('Should create a client', async () => {
        const response = await BaseTest.post('client').set('Authorization', `${access_token}`).send(client1);
        expect(response.status).to.equal(201);
    });
    it('Should not let you create a duplicate client', async () => {
        await BaseTest.post('client').set('Authorization', `${access_token}`).send(client1);
        const response = await BaseTest.post('client').set('Authorization', `${access_token}`).send(client1);
        expect(response.status).to.equal(400);
    });
    it('Should get a client by id', async () => {
        const response = await BaseTest.get(`client/${id}`).set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });
    it('Should get all clients of a manager', async () => {
        const response = await BaseTest.get(`client/manager/email`).set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(200);
    });
    it('Should return an error if the id does not correspond with a client', async () => {
        const response = await BaseTest.get(`client/7689`).set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(400);
    });
    it('Should edit a client', async () => {
        const response = await BaseTest.put(`client/${id}`).set('Authorization', `${access_token}`).send({address: "Najanankumbi"});
        expect(response.status).to.equal(201);
    });
    it('Should edit a client', async () => {
        const response = await BaseTest.delete(`client/${id}`).set('Authorization', `${access_token}`).send({});
        expect(response.status).to.equal(204);
    });

})