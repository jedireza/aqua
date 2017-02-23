'use strict';
const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const PrepareData = require('../../lab/prepare-data');


const lab = exports.lab = Lab.script();
let sequelize;
let AdminGroup;
let Admin;
let Account;
let adminId;
let admin;
const groupNames = ['sales', 'support'];
lab.experiment('Admin Class Methods', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                sequelize = db;
                AdminGroup = sequelize.models.AdminGroup;
                Admin = sequelize.models.Admin;
                Account = sequelize.models.Account;
            }
            done(err);
        });
    });

    lab.test('it returns a new instance when create succeeds', (done) => {

        Admin.create({ first: 'Ren', middle: '', last: 'Höek' }).then( (result) => {

            admin = result;
            Code.expect(admin).to.be.an.instanceOf(Admin.Instance);
            adminId = admin.id;
            done();

        }, ( err ) => {

            done(err);
        });
    });

    lab.test('it correctly sets the middle name when create is called', (done) => {

        const name = Account.parseName('Stimpson J Cat');//todo put parseName in a helper
        Admin.create(name).then( (account) => {

            Code.expect(account.first).to.equal('Stimpson');
            Code.expect(account.middle).to.equal('J');
            Code.expect(account.last).to.equal('Cat');
            Code.expect(account).to.be.an.instanceOf(Admin.Instance);
            done();

        }, ( err ) => {

            done(err);

        });
    });


    lab.test('it returns a result when finding by username', (done) => {

        Async.auto({
            admin: function (cb) {

                Admin.findById(adminId).then( (result) => {

                    cb(null, result);
                }, ( err ) => {

                    cb(err);
                });
            },
            adminUpdated: ['admin', function (results, cb) {

                results.admin.update({
                    first: 'stimpy'
                }).then( ( result ) => {

                    cb(null, result);
                }, ( err ) => {

                    cb(err);
                });
            }]
        }, (err, results) => {

            if (err) {
                return done(err);
            }

            Admin.findOne( { where : { first: 'stimpy' } } ). then( ( result ) => {

                Code.expect(result).to.be.an.instanceOf(Admin.Instance);
                done();
            }, ( err ) => {

                done(err);
            });
        });
    });
});


lab.experiment('Admin Instance Methods', () => {

    lab.test('it returns false when groups are not found', (done) => {

        admin.isMemberOf(sequelize.models, groupNames[0], ( err, isMember ) => {

            if ( err ){
                return done(err);
            }
            Code.expect(isMember).to.equal(false);
            done();
        });
    });


    lab.test('it returns boolean values for set group memberships', (done) => {

        Async.auto({

            sales: function (cb){

                AdminGroup.create( { name: groupNames[0] } ).then( (group) => {

                    cb(null, group);
                }, ( err ) => {

                    cb(err);
                });
            },
            support: function (cb) {

                AdminGroup.create( { name: groupNames[1] } ).then( (group) => {

                    cb(null, group);
                }, ( err ) => {

                    cb(err);
                });
            },
            add: ['sales', 'support', function (results, cb) {

                admin.setAdminGroups( [results.sales, results. support] ).then( (groups) => {

                    cb(null, groups);
                }, (err) => {

                    cb(err);
                });
            }],
            checkSales: ['add', function (results, cb ){

                admin.isMemberOf(sequelize.models, groupNames[0], cb);
            }],
            checkSupport: ['add', function (results, cb ){

                admin.isMemberOf(sequelize.models, groupNames[1], cb);
            }]

        }, (err, results ) => {

            if ( err ) {
                return done(err);
            }
            Code.expect(results.checkSales).to.equal(true);
            Code.expect(results.checkSupport).to.equal(true);
            done();
        });
    });

/* todo doesn't apply I think.  We don't have the functionality of hydrating permissions
 * we just do the sql call.

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
    */
});
