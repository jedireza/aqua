'use strict';
const Code = require('code');
const Config = require('../../../config');
const Fixtures = require('../fixtures');
const Lab = require('lab');
const Status = require('../../../server/models/status');


const lab = exports.lab = Lab.script();
const config = Config.get('/hapiMongoModels/mongodb');


lab.experiment('Status Model', () => {

    lab.before(async () => {

        await Status.connect(config.connection, config.options);
        await Fixtures.Db.removeAllData();
    });


    lab.after(async () => {

        await Fixtures.Db.removeAllData();

        Status.disconnect();
    });


    lab.test('it returns a new instance when create succeeds', async () => {

        const status = await Status.create('Order', 'Complete');

        Code.expect(status).to.be.an.instanceOf(Status);
        Code.expect(status._id).to.equal('order-complete');
        Code.expect(status.name).to.equal('Complete');
        Code.expect(status.pivot).to.equal('Order');
    });
});
