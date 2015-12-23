#!/usr/bin/env node
'use strict';
const Async = require('async');
const Fs = require('fs');
const Handlebars = require('handlebars');
const Mongodb = require('mongodb');
const Path = require('path');
const Promptly = require('promptly');


const configTemplatePath = Path.resolve(__dirname, 'config.example');
const configPath = Path.resolve(__dirname, 'config.js');


if (process.env.NODE_ENV === 'test') {
    const options = { encoding: 'utf-8' };
    const source = Fs.readFileSync(configTemplatePath, options);
    const configTemplateTest = Handlebars.compile(source);
    const context = {
        projectName: 'Aqua',
        mongodbUrl: 'mongodb://localhost:27017/aqua',
        rootEmail: 'root@root',
        rootPassword: 'root',
        systemEmail: 'sys@tem',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        smtpUsername: '',
        smtpPassword: ''
    };
    Fs.writeFileSync(configPath, configTemplateTest(context));
    console.log('Setup complete.');
    process.exit(0);
}

Async.auto({
    projectName: function (done) {

        const options = {
            default: 'Aqua'
        };

        Promptly.prompt(`Project name: (${options.default})`, options, done);
    },
    mongodbUrl: ['projectName', (results, done) => {

        const options = {
            default: 'mongodb://localhost:27017/aqua'
        };

        Promptly.prompt(`MongoDB URL: (${options.default})`, options, done);
    }],
    testMongo: ['rootPassword', (results, done) => {

        Mongodb.MongoClient.connect(results.mongodbUrl, {}, (err, db) => {

            if (err) {
                console.error('Failed to connect to Mongodb.');
                return done(err);
            }

            db.close();
            done(null, true);
        });
    }],
    rootEmail: ['mongodbUrl', (results, done) => {

        Promptly.prompt('Root user email:', done);
    }],
    rootPassword: ['rootEmail', (results, done) => {

        Promptly.password('Root user password:', done);
    }],
    systemEmail: ['rootPassword', (results, done) => {

        const options = {
            default: results.rootEmail
        };

        Promptly.prompt(`System email: (${options.default})`, options, done);
    }],
    smtpHost: ['systemEmail', (results, done) => {

        const options = {
            default: 'smtp.gmail.com'
        };

        Promptly.prompt(`SMTP host: (${options.default})`, options, done);
    }],
    smtpPort: ['smtpHost', (results, done) => {

        const options = {
            default: 465
        };

        Promptly.prompt(`SMTP port: (${options.default})`, options, done);
    }],
    smtpUsername: ['smtpPort', (results, done) => {

        const options = {
            default: results.systemEmail
        };

        Promptly.prompt(`SMTP username: (${options.default})`, options, done);
    }],
    smtpPassword: ['smtpUsername', (results, done) => {

        Promptly.password('SMTP password:', done);
    }],
    createConfig: ['smtpPassword', (results, done) => {

        const fsOptions = { encoding: 'utf-8' };

        Fs.readFile(configTemplatePath, fsOptions, (err, src) => {

            if (err) {
                console.error('Failed to read config template.');
                return done(err);
            }

            const configTemplate = Handlebars.compile(src);
            Fs.writeFile(configPath, configTemplate(results), done);
        });
    }],
    setupRootUser: ['createConfig', (results, done) => {

        const BaseModel = require('hapi-mongo-models').BaseModel;
        const User = require('./server/models/user');
        const Admin = require('./server/models/admin');
        const AdminGroup = require('./server/models/admin-group');

        Async.auto({
            connect: function (done) {

                BaseModel.connect({ url: results.mongodbUrl }, done);
            },
            clean: ['connect', (dbResults, done) => {

                Async.parallel([
                    User.deleteMany.bind(User, {}),
                    Admin.deleteMany.bind(Admin, {}),
                    AdminGroup.deleteMany.bind(AdminGroup, {})
                ], done);
            }],
            adminGroup: ['clean', function (dbResults, done) {

                AdminGroup.create('Root', done);
            }],
            admin: ['clean', function (dbResults, done) {

                Admin.create('Root Admin', done);
            }],
            user: ['clean', function (dbResults, done) {

                User.create('root', results.rootPassword, results.rootEmail, done);
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
