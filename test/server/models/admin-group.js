'use strict';
const AdminGroup = require('../../../server/models/admin-group');
const Code = require('code');
const Config = require('../../../config');
const Lab = require('lab');


const lab = exports.lab = Lab.script();
const mongoUri = Config.get('/hapiMongoModels/mongodb/uri');
const mongoOptions = Config.get('/hapiMongoModels/mongodb/options');


lab.experiment('AdminGroup Class Methods', () => {

    lab.before((done) => {

        AdminGroup.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        AdminGroup.deleteMany({}, (err, count) => {

            AdminGroup.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        AdminGroup.create('Sales', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(AdminGroup);

            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = AdminGroup.insertOne;
        AdminGroup.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        AdminGroup.create('Support', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            AdminGroup.insertOne = realInsertOne;

            done();
        });
    });
});


lab.experiment('AdminGroup Instance Methods', () => {

    lab.before((done) => {

        AdminGroup.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        AdminGroup.deleteMany({}, (err, result) => {

            AdminGroup.disconnect();

            done(err);
        });
    });


    lab.test('it returns false when permissions are not found', (done) => {

        AdminGroup.create('Sales', (err, adminGroup) => {

            Code.expect(err).to.not.exist();
            Code.expect(adminGroup).to.be.an.instanceOf(AdminGroup);
            Code.expect(adminGroup.hasPermissionTo('SPACE_MADNESS')).to.equal(false);

            done();
        });
    });


    lab.test('it returns boolean values for set permissions', (done) => {

        AdminGroup.create('Support', (err, adminGroup) => {

            Code.expect(err).to.not.exist();
            Code.expect(adminGroup).to.be.an.instanceOf(AdminGroup);

            adminGroup.permissions = {
                SPACE_MADNESS: true,
                UNTAMED_WORLD: false
            };

            Code.expect(adminGroup.hasPermissionTo('SPACE_MADNESS')).to.equal(true);
            Code.expect(adminGroup.hasPermissionTo('UNTAMED_WORLD')).to.equal(false);

            done();
        });
    });
});
