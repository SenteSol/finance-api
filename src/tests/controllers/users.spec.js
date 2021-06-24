import chai from 'chai';
const { expect } = chai;

import { BaseTest, MongoClient, mongodbURI } from '../index.spec';

describe('Test the users feature', function() {
    // beforeEach(async () => {
    //     await MongoClient.connect(
    //         mongodbURI,
    //         { useNewUrlParser: true, useUnifiedTopology: true },
    //         function(err, db) {
    //             if (err) throw err;
    //             const dbo = db.db('financialServices_test');
    //             dbo.collection('users').drop(function(err, delOK) {
    //                 if (err) console.log(err, 'failed to delete');
    //                 if (delOK) console.log('Collection deleted');
    //             });
    //         }
    //     );
    // });
    it('Should get all users', async () => {
        const response = await BaseTest.get('auth').send({});
        expect(response.status).to.equal(200);
    });
});
