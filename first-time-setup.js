'use strict';
const Async = require('async');
const MongoModels = require('mongo-models');
const Mongodb = require('mongodb');
const Promptly = require('promptly');


Async.auto({
    mongodbUri: (done) => {

        const options = {
            default: 'mongodb://localhost:27017/aqua'
        };

        Promptly.prompt(`MongoDB URI: (${options.default})`, options, done);
    },
    testMongo: ['mongodbUri', (results, done) => {

        Mongodb.MongoClient.connect(results.mongodbUri, {}, (err, db) => {

            if (err) {
                console.error('Failed to connect to Mongodb.');
                return done(err);
            }

            db.close();
            done(null, true);
        });
    }],
    rootEmail: ['testMongo', (results, done) => {

        Promptly.prompt('Root user email:', done);
    }],
    rootPassword: ['rootEmail', (results, done) => {

        Promptly.password('Root user password:', done);
    }],
    setupRootUser: ['rootPassword', (results, done) => {

        const Account = require('./server/models/account');
        const AdminGroup = require('./server/models/admin-group');
        const Admin = require('./server/models/admin');
        const AuthAttempt = require('./server/models/auth-attempt');
        const Session = require('./server/models/session');
        const Status = require('./server/models/status');
        const User = require('./server/models/user');

        Async.auto({
            connect: function (done) {

                MongoModels.connect(results.mongodbUri, {}, done);
            },
            clean: ['connect', (dbResults, done) => {

                Async.parallel([
                    Account.deleteMany.bind(Account, {}),
                    AdminGroup.deleteMany.bind(AdminGroup, {}),
                    Admin.deleteMany.bind(Admin, {}),
                    AuthAttempt.deleteMany.bind(AuthAttempt, {}),
                    Session.deleteMany.bind(Session, {}),
                    Status.deleteMany.bind(Status, {}),
                    User.deleteMany.bind(User, {})
                ], done);
            }],
            adminGroup: ['clean', function (dbResults, done) {

                AdminGroup.create('Root', done);
            }],
            admin: ['clean', function (dbResults, done) {

                const document = {
                    _id: Admin.ObjectId('111111111111111111111111'),
                    name: {
                        first: 'Root',
                        middle: '',
                        last: 'Admin'
                    },
                    timeCreated: new Date()
                };

                Admin.insertOne(document, (err, docs) => {

                    done(err, docs && docs[0]);
                });
            }],
            user: ['clean', function (dbResults, done) {

                Async.auto({
                    passwordHash: User.generatePasswordHash.bind(this, results.rootPassword)
                }, (err, passResults) => {

                    if (err) {
                        return done(err);
                    }

                    const document = {
                        _id: Admin.ObjectId('000000000000000000000000'),
                        isActive: true,
                        username: 'root',
                        password: passResults.passwordHash.hash,
                        email: results.rootEmail.toLowerCase(),
                        timeCreated: new Date()
                    };

                    User.insertOne(document, (err, docs) => {

                        done(err, docs && docs[0]);
                    });
                });
            }],
            adminMembership: ['admin', function (dbResults, done) {

                const id = dbResults.admin._id.toString();
                const update = {
                    $set: {
                        groups: {
                            root: 'Root'
                        }
                    }
                };

                Admin.findByIdAndUpdate(id, update, done);
            }],
            linkUser: ['admin', 'user', function (dbResults, done) {

                const id = dbResults.user._id.toString();
                const update = {
                    $set: {
                        'roles.admin': {
                            id: dbResults.admin._id.toString(),
                            name: 'Root Admin'
                        }
                    }
                };

                User.findByIdAndUpdate(id, update, done);
            }],
            linkAdmin: ['admin', 'user', function (dbResults, done) {

                const id = dbResults.admin._id.toString();
                const update = {
                    $set: {
                        user: {
                            id: dbResults.user._id.toString(),
                            name: 'root'
                        }
                    }
                };

                Admin.findByIdAndUpdate(id, update, done);
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
