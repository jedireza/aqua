'use strict';
const Sequelize = require('sequelize');
const Config = require('../../config');
const Async = require('async');
const FS = require('fs');
const Path = require('path');

const db = Config.get('/db_test');

const sequelize = new Sequelize(db.database, db.username, db.password, {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
FS.readdirSync('./server/models')
    .filter( (file) => {

        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach( (file) => {

        sequelize.import(Path.join(process.cwd(), 'server/models', file));
    });

Object.keys(sequelize.models).forEach((key) => {

    const model = sequelize.models[key];
    if ( 'associate' in model){
        model.associate(sequelize.models);
    }
});
const Admin = sequelize.models.Admin;
const AdminGroup = sequelize.models.AdminGroup;
const Account = sequelize.models.Account;
const User = sequelize.models.User;
const state = { before : 0, during: 1, after: 2 };
let init = state.before;
const callbacks = [];

module.exports = (callback) => {

    if ( init === state.after ){
        return callback(null);
    }
    callbacks.push(callback);
    if ( init === state.during ){
        return;
    }
    init = state.during;
    //todo duplicate code between here and setup
    Async.auto({

        sync: function (done){

            sequelize.sync({ force: true }).then(() => {

                done(null);
            }, (err) => {

                done(err);
            });
        },
        clean: ['sync', (iresults, done) => {

            AdminGroup.destroy({ where: {} }).then(() => {

                return Admin.destroy({ where: {} });
            }).then(() => {

                return Account.destroy({ where: {} });
            }).then(() => {

                return User.destroy({ where: {} });
            }).then(() => {

                done(null);
            }, (err) => {

                done(err);
            });
        }],
        createAdmin: ['clean', function (iresults, done){

            Admin.create(
                {
                    id : '11111111-1111-1111-1111-111111111111',
                    first: 'Root',
                    middle: '',
                    last: 'Admin'
                }).then((admin) => {

                    done(null, admin);
                }, (err) => {

                    done(err);
                });

        }],
        createNotRootAdmin: ['createAdmin', function (iresults, done){

            Admin.create(
                {
                    id : '22222222-2222-2222-2222-222222222222',
                    first: 'Not',
                    middle: 'Root',
                    last: 'Admin'
                }).then((admin) => {

                    done(null, admin);
                }, (err) => {

                    done(err);
                });

        }],
        createAdminGroup: ['clean', function (iresults, done){

            AdminGroup.create(
                {
                    name: 'Root'
                }).then((adminGroup) => {

                    done(null, adminGroup);
                }, (err) => {

                    done(err);
                });
        }],
        createUser : ['clean',function (iresults, done){

            User.create({
                id : '00000000-0000-0000-0000-000000000000',
                username : 'root',
                isActive: true,
                password : 'test',
                email : 'test@test.com'
            }).then((user) => {

                done(null, user);
            }, (err) => {

                done(err);
            });
        }],
        createNotRootAdminUser : ['clean',function (iresults, done){

            User.create({
                id : '33333333-3333-3333-3333-333333333333',
                username : 'notrootadmin',
                isActive: true,
                password : 'test',
                email : 'notrootadmin@test.com'
            }).then((user) => {

                done(null, user);
            }, (err) => {

                done(err);
            });
        }],
        linkUser : ['createUser', 'createAdmin', function (iresults, done){

            iresults.createAdmin.setUser(iresults.createUser).then(

                () => {

                    done(null);
                }, (err) => {

                done(err);
            }
            );
        }],
        linkNotRootAdmin : ['createNotRootAdminUser', 'createNotRootAdmin', function (iresults, done){

            iresults.createNotRootAdmin.setUser(iresults.createNotRootAdminUser).then(

                () => {

                    done(null);
                }, (err) => {

                done(err);
            }
            );
        }],
        linkAdmin : ['createAdmin', 'createAdminGroup', function (iresults, done){

            iresults.createAdminGroup.setAdmins(iresults.createAdmin).then(

                () => {

                    done(null);
                }, (err) => {

                done(err);
            }
            );
        }],
        createAccount: ['clean', function (iresults, done){

            Account.create(
                {
                    id : '00000000-0000-0000-0000-000000000000',
                    first: 'Test',
                    middle: '',
                    last: 'Account'
                }).then((admin) => {

                    done(null, admin);
                }, (err) => {

                    done(err);
                });

        }],
        createAccountUser : ['clean',function (iresults, done){

            User.create({
                id : '11111111-1111-1111-1111-111111111111',
                username : 'accountuser',
                isActive: true,
                password : 'test',
                email : 'accountuser@test.com'
            }).then((user) => {

                done(null, user);
            }, (err) => {

                done(err);
            });
        }],
        linkAccountAndUser : ['createAccount', 'createAccountUser', function (iresults, done){

            iresults.createAccountUser.setAccount(iresults.createAccount).then(

                () => {

                    done(null);
                }, (err) => {

                done(err);
            });
        }],
        createNoRolesUser : ['linkAccountAndUser',function (iresults, done){

            User.create({
                id : '22222222-2222-2222-2222-222222222222',
                username : 'noroles',
                isActive: true,
                password : 'test',
                email : 'noroles@test.com'
            }).then((user) => {

                done(null, user);
            }, (err) => {

                done(err);
            });
        }],
        createOtherAdminGroup: ['createNoRolesUser', function (iresults, done){

            AdminGroup.create(
                {
                    name: 'OtherRoot'
                }).then((adminGroup) => {

                    done(null, adminGroup);
                }, (err) => {

                    done(err);
                });
        }]
    }, (err, dbResults) => {

        callbacks.forEach( (cb) => {

            cb(err);
        });
        callbacks.length = 0;
        init = state.after;

    });
};
