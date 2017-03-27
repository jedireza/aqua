'use strict';
const Async = require('async');
const Sequelize = require('sequelize');
const Promptly = require('promptly');


Async.auto({
    pgHost: (done) => {

        const options = {
            default: 'localhost'
        };
        Promptly.prompt(`Postgres DB Host Name: (${options.default})`, options, done);
    },
    pgName:['pgHost', (results, done) => {

        const options = {
            default: 'aqua'
        };
        Promptly.prompt(`Postgres DB Name: (${options.default})`, options, done);
    }],
    pgUser:['pgName', (results, done) => {

        const options = {
            default: 'aqua'
        };

        Promptly.prompt(`Postgres DB User: (${options.default})`, options, done);
    }],
    pgPass: ['pgUser', (results, done) => {

        const options = {
            default: 'test'
        };
        Promptly.prompt(`Postgres DB Password: (${options.default})`, options, done);
    }],
    testPg: ['pgPass', (results, done) => {

        const sequelize = new Sequelize(results.pgName, results.pgUser, results.pgPass, {
            host: results.pgHost,
            dialect: 'postgres',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
        sequelize.authenticate().then(
             () => {

                 console.log('connection successfull');
                 done(null, sequelize);
             },
             (err) => {

                 console.log('connection error: ', err);
                 return done(err);
             }
        );
    }],
    pgTestHost: ['testPg', (results, done) => {

        const options = {
            default: 'localhost'
        };
        Promptly.prompt(`Postgres Test DB Host Name: (${options.default})`, options, done);
    }],
    pgTestName: ['pgTestHost', (results, done) => {

        const options = {
            default: 'aqua_test'
        };
        Promptly.prompt(`Postgres Test DB Name: (${options.default})`, options, done);
    }],

    pgTestUser:['pgTestName', (results, done) => {

        const options = {
            default: 'aqua'
        };

        Promptly.prompt(`Postgres Test DB User: (${options.default})`, options, done);
    }],
    pgTestPass: ['pgTestUser', (results, done) => {

        const options = {
            default: 'test'
        };
        Promptly.prompt(`Postgres Test DB Password: (${options.default})`, options, done);
    }],
    testTestPg: ['pgTestPass', (results, done) => {

        const sequelize = new Sequelize(results.pgTestName, results.pgTestUser, results.pgTestPass, {
            host: results.pgTestHost,
            dialect: 'postgres',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
        sequelize.authenticate().then(
             () => {

                 console.log('connection successfull');
                 done(null, sequelize);
             },
             (err) => {

                 console.log('connection error: ', err);
                 return done(err);
             }
        );
    }],
    rootEmail: ['testTestPg', (results, done) => {

        const options = {
            default: 'root@root.com'
        };
        Promptly.prompt('Root user email:', options, done);
    }],
    rootPassword: ['rootEmail', (results, done) => {

        const options = {
            default: 'password'
        };
        Promptly.password('Root user password:', options, done);
    }],
    setupRootUser: ['rootPassword', (results, done) => {

        const sequelize = results.testPg;
        const Account = sequelize.import('./server/models/account');
        const Admin = sequelize.import('./server/models/admin');
        const AdminGroup = sequelize.import('./server/models/admin-group');
        sequelize.import('./server/models/admin-group-permission-entry');
        sequelize.import('./server/models/admin-permission-entry');
        sequelize.import('./server/models/auth-attempt');
        sequelize.import('./server/models/note-entry');
        sequelize.import('./server/models/permission');
        sequelize.import('./server/models/session');
        sequelize.import('./server/models/status');
        sequelize.import('./server/models/status-entry');
        const User = sequelize.import('./server/models/user');

        Object.keys(sequelize.models).forEach((key) => {

            const model = sequelize.models[key];
            if ( 'associate' in model){
                model.associate(sequelize.models);
            }
        });

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
                    password : results.rootPassword,
                    email : results.rootEmail
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
            linkAdmin : ['createAdmin', 'createAdminGroup', function (iresults, done){

                iresults.createAdminGroup.setAdmins(iresults.createAdmin).then(

                    () => {

                        done(null);
                    }, (err) => {

                    done(err);
                }
                );
            }]
        }, (err, dbResults) => {

            if (err) {
                console.error('Failed to setup root user.');
                return done(err);
            }

            done(null, true);
        });
    }]
}, (err, results) => {

    if (err) {
        console.error('Setup failed.');
        console.error(err);
        return process.exit(1);
    }

    console.log('Setup complete.');
    process.exit(0);
});
