'use strict';
const AuthPlugin = require('../../../server/auth');
const Bcrypt = require('bcrypt');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const LoginPlugin = require('../../../server/api/login');
const MailerPlugin = require('../../../server/mailer');
const Async = require('async');
const PrepareData = require('../../lab/prepare-data');
const Proxyquire = require('proxyquire');
const stub = {
    get: function (key){

        if ( key === '/db' ){
            key = '/db_test';
        }
        //is there a way to access the origianl function?
        //without loading ConfigOriginal
        return Config.get(key);
    }
};

const DBSetup = Proxyquire('../../../dbsetup', { './config' : stub });

/*
todo: will need sql script with admin perms on the db to set up db name and user
learned that hapi-sequelize registration was missing next in the correct spot
probably can go through all api handlers and move the models out to the set up scope
instead of the handler scope
*/
const lab = exports.lab = Lab.script();
let request;
let server;
let db;
let AuthAttempt;
let Session;
let User;
let authAttemptAbuseDetected;
let authAttemptCreate;
let userFindByCredentials;
let userFindOne;
let sessionCreateNew;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, MailerPlugin, LoginPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                AuthAttempt = db.models.AuthAttempt;
                User = db.models.User;
                Session = db.models.Session;
                authAttemptAbuseDetected = AuthAttempt.abuseDetected;
                authAttemptCreate = AuthAttempt.create;
                userFindByCredentials = User.findByCredentials;
                sessionCreateNew = Session.createNew;
                userFindOne = User.findOne;
                server.initialize(cb);
            });
        }]
    }, (err, results ) => {

        if ( err ){
            done(err);
        }
        else {
            done();
        }
    });
});

lab.after((done) => {

    done();
});

lab.experiment('Login Plugin (Create Session)', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/login',
            payload: {
                username: 'accountuser',
                password: 'test'
            }
        };

        done();
    });


    lab.test('it returns an error when detecting abuse fails', (done) => {

        AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(Error('abuse detection failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AuthAttempt.abuseDetected = authAttemptAbuseDetected;
            done();
        });
    });


    lab.test('it returns early when abuse is detected', (done) => {

        AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, true);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.match(/maximum number of auth attempts reached/i);
            AuthAttempt.abuseDetected = authAttemptAbuseDetected;

            done();
        });
    });


    lab.test('it returns an error when find by credentials fails', (done) => {

        AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        User.findByCredentials = function (username, password, callback) {

            callback(Error('find by credentials failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AuthAttempt.abuseDetected = authAttemptAbuseDetected;
            User.findByCredentials = userFindByCredentials;
            done();
        });
    });


    lab.test('it returns an error when creating a new auth attempt fails', (done) => {

        AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        AuthAttempt.create = function (ip, username) {

            return new Promise( (resolve, reject ) => {

                reject(Error('create auth attempt failed'));
            });
        };

        User.findByCredentials = function (username, password, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AuthAttempt.abuseDetected = authAttemptAbuseDetected;
            AuthAttempt.create = authAttemptCreate;
            User.findByCredentials = userFindByCredentials;
            done();
        });
    });


    lab.test('it returns early after creating a new auth attempt', (done) => {

        AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        AuthAttempt.create = function (ip, username) {

            return new Promise( (resolve, reject ) => {

                resolve({});
            });
        };

        User.findByCredentials = function (username, password, callback) {

            callback();
        };
        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.match(/username and password combination not found/i);
            AuthAttempt.abuseDetected = authAttemptAbuseDetected;
            AuthAttempt.create = authAttemptCreate;
            User.findByCredentials = userFindByCredentials;

            done();
        });
    });

    lab.test('it returns an error when creating a new session fails', (done) => {

        AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        AuthAttempt.create = function (ip, username, callback) {

            return new Promise( ( resolve, reject ) => {

                resolve({});
            });
        };

        Session.createNew = function (username, callback) {

            callback(Error('create session failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AuthAttempt.abuseDetected = authAttemptAbuseDetected;
            AuthAttempt.create = authAttemptCreate;
            User.findByCredentials = userFindByCredentials;
            Session.createNew = sessionCreateNew;
            done();
        });
    });

    lab.test('it returns a session successfully', (done) => {

        AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        AuthAttempt.create = function (ip, username, callback) {

            return new Promise( ( resolve, reject ) => {

                resolve({});
            });
        };

        Session.createNew = function (username, callback) {

            callback(null, {
                id: 'abc',
                key: 'def'
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            AuthAttempt.abuseDetected = authAttemptAbuseDetected;
            AuthAttempt.create = authAttemptCreate;
            User.findByCredentials = userFindByCredentials;
            Session.createNew = sessionCreateNew;

            done();
        });
    });
});

lab.experiment('Login Plugin Forgot Password', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/login/forgot',
            payload: {
                email: 'ren@stimpy.show'
            }
        };

        done();
    });


    lab.test('it returns an error when find one fails', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('find one failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns early when find one misses', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            User.findOne = userFindOne;
            done();
        });
    });

    lab.test('it returns an error if any critical step fails', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    update: function (options){

                        return new Promise( (inner_resolve, inner_reject ) => {

                            inner_reject(Error('update failed'));
                        });
                    }
                });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it succussfully sends a reset password request', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    update: function (options){

                        return new Promise( (inner_resolve, inner_reject ) => {

                            inner_resolve({
                                email: 'test@test.com'
                            });
                        });
                    }
                });
            });
        };

        const realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            server.plugins.mailer.sendEmail = realSendEmail;
            User.findOne = userFindOne;

            done();
        });
    });
});

lab.experiment('Login Plugin Reset Password', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/login/reset',
            payload: {
                key: 'abcdefgh-ijkl-mnop-qrst-uvwxyz123456',
                email: 'ren@stimpy.show',
                password: 'letmein'
            }
        };

        done();
    });


    lab.test('it returns an error when find one fails', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('find one failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns a bad request when find one misses', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns an error if any critical step fails', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    id: 'abc',
                    email: 'test@test.com',
                    reset_token: 'O0HL4L4',
                    update: function (options){

                        return new Promise( (inner_resolve, inner_reject ) => {

                            inner_resolve({});
                        });
                    }
                });
            });
        };

        const realBcryptCompare = Bcrypt.compare;
        Bcrypt.compare = function (key, token, callback) {

            callback(Error('compare failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Bcrypt.compare = realBcryptCompare;
            User.findOne = userFindOne;

            done();
        });
    });



    lab.test('it returns a bad request if the key does not match', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    id: 'abc',
                    email: 'test@test.com',
                    reset_token: 'O0HL4L4',
                    update: function (options){

                        return new Promise( (inner_resolve, inner_reject ) => {

                            inner_resolve({});
                        });
                    }
                });
            });
        };

        const realBcryptCompare = Bcrypt.compare;
        Bcrypt.compare = function (key, token, callback) {

            callback(null, false);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Bcrypt.compare = realBcryptCompare;
            User.findOne = userFindOne;

            done();
        });
    });


    lab.test('it succussfully sets a password', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    id: 'abc',
                    email: 'test@test.com',
                    reset_token: 'O0HL4L4',
                    update: function (options){

                        return new Promise( (inner_resolve, inner_reject ) => {

                            inner_resolve({});
                        });
                    }
                });
            });
        };

        const realBcryptCompare = Bcrypt.compare;
        Bcrypt.compare = function (key, token, callback) {

            callback(null, true);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Bcrypt.compare = realBcryptCompare;
            User.findOne = userFindOne;

            done();
        });
    });
});
