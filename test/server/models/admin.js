'use strict';
const Async = require('async');
const Code = require('code');
const Config = require('../../../config');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const mongoUri = Config.get('/hapiMongoModels/mongodb/uri');
const mongoOptions = Config.get('/hapiMongoModels/mongodb/options');
const stub = {
    AdminGroup: {}
};
const Admin = Proxyquire('../../../server/models/admin', {
    './admin-group': stub.AdminGroup
});
const AdminGroup = require('../../../server/models/admin-group');


lab.experiment('Admin Class Methods', () => {

    lab.before((done) => {

        Admin.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        Admin.deleteMany({}, (err, count) => {

            Admin.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        Admin.create('Ren Höek', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Admin);

            done();
        });
    });


    lab.test('it correctly sets the middle name when create is called', (done) => {

        Admin.create('Stimpson J Cat', (err, admin) => {

            Code.expect(err).to.not.exist();
            Code.expect(admin).to.be.an.instanceOf(Admin);
            Code.expect(admin.name.middle).to.equal('J');

            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = Admin.insertOne;
        Admin.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        Admin.create('Stimpy Cat', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Admin.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by username', (done) => {

        Async.auto({
            admin: function (cb) {

                Admin.create('Ren Höek', cb);
            },
            adminUpdated: ['admin', function (results, cb) {

                const fieldsToUpdate = {
                    $set: {
                        user: {
                            id: '95EP150D35',
                            name: 'ren'
                        }
                    }
                };

                Admin.findByIdAndUpdate(results.admin._id, fieldsToUpdate, cb);
            }]
        }, (err, results) => {

            if (err) {
                return done(err);
            }

            Admin.findByUsername('ren', (err, admin) => {

                Code.expect(err).to.not.exist();
                Code.expect(admin).to.be.an.instanceOf(Admin);

                done();
            });
        });
    });
});


lab.experiment('Admin Instance Methods', () => {

    lab.before((done) => {

        Admin.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        Admin.deleteMany({}, (err, result) => {

            Admin.disconnect();

            done(err);
        });
    });


    lab.test('it returns false when groups are not found', (done) => {

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        });

        Code.expect(admin.isMemberOf('sales')).to.equal(false);

        done();
    });


    lab.test('it returns boolean values for set group memberships', (done) => {

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales',
                support: 'Support'
            }
        });

        Code.expect(admin.isMemberOf('sales')).to.equal(true);
        Code.expect(admin.isMemberOf('support')).to.equal(true);

        done();
    });


    lab.test('it exits early when hydrating groups where groups are missing', (done) => {

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        });

        admin.hydrateGroups((err) => {

            Code.expect(err).to.not.exist();

            done();
        });
    });


    lab.test('it exits early when hydrating groups where hydrated groups exist', (done) => {

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            },
            _groups: {
                sales: new AdminGroup({
                    _id: 'sales',
                    name: 'Sales',
                    permissions: {
                        SPACE_MADNESS: true,
                        UNTAMED_WORLD: false
                    }
                })
            }
        });

        admin.hydrateGroups((err) => {

            Code.expect(err).to.not.exist();

            done();
        });
    });


    lab.test('it returns an error when hydrating groups and find by id fails', (done) => {

        const realFindById = stub.AdminGroup.findById;
        stub.AdminGroup.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            }
        });

        admin.hydrateGroups((err) => {

            Code.expect(err).to.be.an.object();

            stub.AdminGroup.findById = realFindById;

            done();
        });
    });


    lab.test('it successfully hydrates groups', (done) => {

        const realFindById = stub.AdminGroup.findById;
        stub.AdminGroup.findById = function (id, callback) {

            const group = new AdminGroup({
                _id: 'sales',
                name: 'Sales',
                permissions: {
                    SPACE_MADNESS: true,
                    UNTAMED_WORLD: false
                }
            });

            callback(null, group);
        };

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            }
        });

        admin.hydrateGroups((err) => {

            Code.expect(err).to.not.exist();

            stub.AdminGroup.findById = realFindById;

            done();
        });
    });


    lab.test('it exits early when the permission exists on the admin', (done) => {

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            permissions: {
                SPACE_MADNESS: true,
                UNTAMED_WORLD: false
            }
        });

        admin.hasPermissionTo('SPACE_MADNESS', (err, permit) => {

            Code.expect(err).to.not.exist();
            Code.expect(permit).to.equal(true);

            done();
        });
    });


    lab.test('it returns an error when checking permission and hydrating groups fails', (done) => {

        const realHydrateGroups = Admin.prototype.hydrateGroups;
        Admin.prototype.hydrateGroups = function (callback) {

            callback(Error('hydrate groups failed'));
        };

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            }
        });

        admin.hasPermissionTo('SPACE_MADNESS', (err) => {

            Code.expect(err).to.be.an.object();

            Admin.prototype.hydrateGroups = realHydrateGroups;

            done();
        });
    });


    lab.test('it returns correct permission from hydrated group permissions', (done) => {

        const admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales',
                support: 'Support'
            }
        });

        admin._groups = {
            sales: new AdminGroup({
                _id: 'sales',
                name: 'Sales',
                permissions: {
                    UNTAMED_WORLD: false,
                    WORLD_UNTAMED: true
                }
            }),
            support: new AdminGroup({
                _id: 'support',
                name: 'Support',
                permissions: {
                    SPACE_MADNESS: true,
                    MADNESS_SPACE: false
                }
            })
        };

        Async.auto({
            test1: function (cb) {

                admin.hasPermissionTo('SPACE_MADNESS', cb);
            },
            test2: function (cb) {

                admin.hasPermissionTo('UNTAMED_WORLD', cb);
            }
        }, (err, results) => {

            Code.expect(err).to.not.exist();
            Code.expect(results.test1).to.equal(true);
            Code.expect(results.test2).to.equal(false);

            done(err);
        });
    });
});
