'use strict';
const AdminGroup = require('../../../server/models/admin-group');
const Code = require('code');
const Config = require('../../../config');
const Fixtures = require('../fixtures');
const Lab = require('lab');


const lab = exports.lab = Lab.script();
const config = Config.get('/hapiMongoModels/mongodb');


lab.experiment('AdminGroup Model', () => {

    lab.before(async () => {

        await AdminGroup.connect(config.connection, config.options);
        await Fixtures.Db.removeAllData();
    });


    lab.after(async () => {

        await Fixtures.Db.removeAllData();

        AdminGroup.disconnect();
    });


    lab.test('it returns a new instance when create succeeds', async () => {

        const adminGroup = await AdminGroup.create('Sales');

        Code.expect(adminGroup).to.be.an.instanceOf(AdminGroup);
    });


    lab.test('it returns false when permissions are missing', async () => {

        const adminGroup = await AdminGroup.create('Missing');

        Code.expect(adminGroup.hasPermissionTo('SPACE_MADNESS')).to.equal(false);
    });


    lab.test('it returns boolean values for set permissions', async () => {

        const adminGroup = await AdminGroup.create('Support');

        adminGroup.permissions = {
            SPACE_MADNESS: true,
            UNTAMED_WORLD: false
        };

        Code.expect(adminGroup.hasPermissionTo('SPACE_MADNESS')).to.equal(true);
        Code.expect(adminGroup.hasPermissionTo('UNTAMED_WORLD')).to.equal(false);
    });
});
