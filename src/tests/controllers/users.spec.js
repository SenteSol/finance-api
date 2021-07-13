import chai from 'chai';
const { expect } = chai;

import { BaseTest, mongodbURI } from '../index.spec';
import User from '../../models/Users'
import { user1, user3 } from '../__mocks__/users';
const mongoose = require('mongoose');//tell mongoose to use es6 implementation of promises

describe('Test the users feature', function() {
    before('connect', function(){
        return mongoose.createConnection(mongodbURI)
    })

    beforeEach(function(){
        return User.deleteMany({})
    })

    beforeEach(function() {
        const {userId, firstName, lastName, email, password} = user1
        const newUser = new User({
            userId,
            firstName,
            lastName,
            email,
            password
        });
        return newUser.save();
    });
    it('logs in a user', async () => {
        const response = await BaseTest.post('auth/login').send({
            email: 'nserekopaul@gmail.com',
            password: 'P@ssw0rd',
        });
        expect(response.status).to.equal(201);
        expect(response.body.success).to.equal(
            true
        );
    });
    it('fails to log in a user', async () => {
        const response = await BaseTest.post('auth/login').send({
            email: 'bahendeka@gmail.com',
            password: 'P@ssw0rd',
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
            'User not found'
        );
    });
    it('Fails to log in user when incorrect password is provided', async () => {
        const response = await BaseTest.post('auth/login').send({
            email: 'nserekopaul@gmail.com',
            password: 'P@ssw0rdd',
        });
        expect(response.status).to.equal(400);
    });
    it('Should get all users', async () => {
        const response = await BaseTest.get('auth').send({});
        expect(response.status).to.equal(200);
    });
    it('tests for the creation of a user', async () => {
        const response = await BaseTest.post('auth').send(user3);
        expect(response.status).to.equal(201);
        expect(response.body.user.firstName).to.equal('frank');
    });
});
