#!/usr/bin/env node
var Fs = require('fs');
var Path = require('path');
var Async = require('async');
var Promptly = require('promptly');
var Mongodb = require('mongodb');
var Handlebars = require('handlebars');


var configTemplatePath = Path.resolve(__dirname, 'config.example');
var configPath = Path.resolve(__dirname, 'config.js');


if (process.env.NODE_ENV === 'test') {
    var options = { encoding: 'utf-8' };
    var source = Fs.readFileSync(configTemplatePath, options);
    var configTemplate = Handlebars.compile(source);
    var context = {
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
    Fs.writeFileSync(configPath, configTemplate(context));
    console.log('Setup complete.');
    process.exit(0);
}

Async.auto({
    projectName: function (done) {

        Promptly.prompt('Project name: (Aqua)', { default: 'Aqua' }, done);
    },
    mongodbUrl: ['projectName', function (done, results) {

        var promptOptions = {
            default: 'mongodb://localhost:27017/aqua'
        };

        Promptly.prompt('MongoDB URL: (mongodb://localhost:27017/aqua)', promptOptions, done);
    }],
    testMongo: ['rootPassword', function (done, results) {

        Mongodb.MongoClient.connect(results.mongodbUrl, {}, function (err, db) {

            if (err) {
                console.error('Failed to connect to Mongodb.');
                return done(err);
            }

            db.close();
            done(null, true);
        });
    }],
    rootEmail: ['mongodbUrl', function (done, results) {

        Promptly.prompt('Root user email:', done);
    }],
    rootPassword: ['rootEmail', function (done, results) {

        Promptly.password('Root user password:', { default: null }, done);
    }],
    systemEmail: ['rootPassword', function (done, results) {

        var promptOptions = {
            default: results.rootEmail
        };

        Promptly.prompt('System email: (' + results.rootEmail + ')', promptOptions, done);
    }],
    smtpHost: ['systemEmail', function (done, results) {

        Promptly.prompt('SMTP host: (smtp.gmail.com)', { default: 'smtp.gmail.com' }, done);
    }],
    smtpPort: ['smtpHost', function (done, results) {

        Promptly.prompt('SMTP port: (465)', { default: 465 }, done);
    }],
    smtpUsername: ['smtpPort', function (done, results) {

        var promptOptions = {
            default: results.systemEmail
        };

        Promptly.prompt('SMTP username: (' + results.systemEmail + ')', promptOptions, done);
    }],
    smtpPassword: ['smtpUsername', function (done, results) {

        Promptly.password('SMTP password:', done);
    }],
    createConfig: ['smtpPassword', function (done, results) {

        var fsOptions = { encoding: 'utf-8' };

        Fs.readFile(configTemplatePath, fsOptions, function (err, src) {

            if (err) {
                console.error('Failed to read config template.');
                return done(err);
            }

            configTemplate = Handlebars.compile(src);
            Fs.writeFile(configPath, configTemplate(results), done);
        });
    }],
    setupRootUser: ['createConfig', function (done, results) {

        var BaseModel = require('hapi-mongo-models').BaseModel;
        var User = require('./server/models/user');
        var Admin = require('./server/models/admin');
        var AdminGroup = require('./server/models/admin-group');
        var Account = require('./server/models/account');

        Async.auto({
            connect: function (done) {

                BaseModel.connect({ url: results.mongodbUrl }, done);
            },
            clean: ['connect', function (done) {

                Async.parallel([
                    User.deleteMany.bind(User, {}),
                    Admin.deleteMany.bind(Admin, {}),
                    AdminGroup.deleteMany.bind(AdminGroup, {}),
                    Account.deleteMany.bind(Account, {})
                ], done);
            }],
            adminGroup: ['clean', function (done) {

                AdminGroup.create('Root', done);
            }],
            admin: ['clean', function (done) {

                Admin.create('Root Admin', done);
            }],
            user: ['clean', function (done, dbResults) {

                User.create('root', results.rootPassword, results.rootEmail, done);
            }],
            adminMembership: ['admin', function (done, dbResults) {

                var id = dbResults.admin._id.toString();
                var update = {
                    $set: {
                        groups: {
                            root: 'Root'
                        }
                    }
                };

                Admin.findByIdAndUpdate(id, update, done);
            }],
            linkUser: ['admin', 'user', function (done, dbResults) {

                var id = dbResults.user._id.toString();
                var update = {
                    $set: {
                        'roles.admin': {
                            id: dbResults.admin._id.toString(),
                            name: 'Root Admin'
                        }
                    }
                };

                User.findByIdAndUpdate(id, update, done);
            }],
            linkAdmin: ['admin', 'user', function (done, dbResults) {

                var id = dbResults.admin._id.toString();
                var update = {
                    $set: {
                        user: {
                            id: dbResults.user._id.toString(),
                            name: 'root'
                        }
                    }
                };

                Admin.findByIdAndUpdate(id, update, done);
            }]
        }, function (err, dbResults) {

            if (err) {
                console.error('Failed to setup root user.');
                return done(err);
            }

            done(null, true);
        });
    }]
}, function (err, results) {

    if (err) {
        console.error('Setup failed.');
        console.error(err);
        return process.exit(1);
    }

    console.log('Setup complete.');
    process.exit(0);
});
