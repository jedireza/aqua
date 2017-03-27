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

        admin.isMemberOf(groupNames[0], ( err, isMember ) => {

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

                admin.isMemberOf(groupNames[0], cb);
            }],
            checkSupport: ['add', function (results, cb ){

                admin.isMemberOf(groupNames[1], cb);
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
});
