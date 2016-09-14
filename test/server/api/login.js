'use strict';
const AuthAttempt = require('../../../server/models/auth-attempt');
const AuthPlugin = require('../../../server/auth');
const Bcrypt = require('bcrypt');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const LoginPlugin = require('../../../server/api/login');
const MailerPlugin = require('../../../server/mailer');
const MakeMockModel = require('../fixtures/make-mock-model');
const Manifest = require('../../../manifest');
const Path = require('path');
const Proxyquire = require('proxyquire');
const Session = require('../../../server/models/session');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
let request;
let server;
let stub;


lab.before((done) => {

    stub = {
        AuthAttempt: MakeMockModel(),
        Session: MakeMockModel(),
        User: MakeMockModel()
    };

    const proxy = {};
    proxy[Path.join(process.cwd(), './server/models/auth-attempt')] = stub.AuthAttempt;
    proxy[Path.join(process.cwd(), './server/models/session')] = stub.Session;
    proxy[Path.join(process.cwd(), './server/models/user')] = stub.User;

    const ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/registrations').filter((reg) => {

            if (reg.plugin &&
                reg.plugin.register &&
                reg.plugin.register === 'hapi-mongo-models') {

                return true;
            }

            return false;
        })[0].plugin.options
    };

    const plugins = [HapiAuth, ModelsPlugin, AuthPlugin, MailerPlugin, LoginPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.initialize(done);
    });
});


lab.after((done) => {

    server.plugins['hapi-mongo-models'].MongoModels.disconnect();
    done();
});


lab.experiment('Login Plugin (Create Session)', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/login',
            payload: {
                username: 'ren',
                password: 'baddog'
            }
        };

        done();
    });


    lab.test('it returns an error when detecting abuse fails', (done) => {

        stub.AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(Error('abuse detection failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns early when abuse is detected', (done) => {

        stub.AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, true);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.match(/maximum number of auth attempts reached/i);

            done();
        });
    });


    lab.test('it returns an error when find by credentials fails', (done) => {

        stub.AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        stub.User.findByCredentials = function (username, password, callback) {

            callback(Error('find by credentials failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an error when creating a new auth attempt fails', (done) => {

        stub.AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        stub.AuthAttempt.create = function (ip, username, callback) {

            callback(Error('create auth attempt failed'));
        };

        stub.User.findByCredentials = function (username, password, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns early after creating a new auth attempt', (done) => {

        stub.AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        stub.AuthAttempt.create = function (ip, username, callback) {

            callback(null, new AuthAttempt({}));
        };

        stub.User.findByCredentials = function (username, password, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            Code.expect(response.result.message).to.match(/username and password combination not found/i);

            done();
        });
    });


    lab.test('it returns an error when creating a new session fails', (done) => {

        stub.AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        stub.AuthAttempt.create = function (ip, username, callback) {

            callback(null, new AuthAttempt({}));
        };

        stub.User.findByCredentials = function (username, password, callback) {

            callback(null, new User({ _id: '1D', username: 'ren' }));
        };

        stub.Session.create = function (username, callback) {

            callback(Error('create session failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a session successfully', (done) => {

        stub.AuthAttempt.abuseDetected = function (ip, username, callback) {

            callback(null, false);
        };

        stub.AuthAttempt.create = function (ip, username, callback) {

            callback(null, new AuthAttempt({}));
        };

        stub.User.findByCredentials = function (username, password, callback) {

            callback(null, new User({ _id: '1D', username: 'ren' }));
        };

        stub.Session.create = function (username, callback) {

            callback(null, new Session({ _id: '2D', userId: '1D' }));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

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

        stub.User.findOne = function (conditions, callback) {

            callback(Error('find one failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns early when find one misses', (done) => {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns an error if any critical step fails', (done) => {

        stub.User.findOne = function (conditions, callback) {

            const user = {
                _id: 'BL4M0'
            };

            callback(null, user);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it succussfully sends a reset password request', (done) => {

        stub.User.findOne = function (conditions, callback) {

            const user = {
                _id: 'BL4M0'
            };

            callback(null, user);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        const realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);

            server.plugins.mailer.sendEmail = realSendEmail;

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

        stub.User.findOne = function (conditions, callback) {

            callback(Error('find one failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a bad request when find one misses', (done) => {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);
            done();
        });
    });


    lab.test('it returns an error if any critical step fails', (done) => {

        stub.User.findOne = function (conditions, callback) {

            const user = {
                _id: 'BL4M0',
                resetPassword: {
                    token: 'O0HL4L4'
                }
            };

            callback(null, user);
        };

        const realBcryptCompare = Bcrypt.compare;
        Bcrypt.compare = function (key, token, callback) {

            callback(Error('compare failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);

            Bcrypt.compare = realBcryptCompare;

            done();
        });
    });


    lab.test('it returns a bad request if the key does not match', (done) => {

        stub.User.findOne = function (conditions, callback) {

            const user = {
                _id: 'BL4M0',
                resetPassword: {
                    token: 'O0HL4L4'
                }
            };

            callback(null, user);
        };

        const realBcryptCompare = Bcrypt.compare;
        Bcrypt.compare = function (key, token, callback) {

            callback(null, false);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);

            Bcrypt.compare = realBcryptCompare;

            done();
        });
    });


    lab.test('it succussfully sets a password', (done) => {

        stub.User.findOne = function (conditions, callback) {

            const user = {
                _id: 'BL4M0',
                resetPassword: {
                    token: 'O0HL4L4'
                }
            };

            callback(null, user);
        };

        const realBcryptCompare = Bcrypt.compare;
        Bcrypt.compare = function (key, token, callback) {

            callback(null, true);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);

            Bcrypt.compare = realBcryptCompare;

            done();
        });
    });
});
