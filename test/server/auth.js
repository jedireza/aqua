'use strict';
const AuthPlugin = require('../../server/auth');
const Credentials = require('./fixtures/credentials');
const Code = require('code');
const Config = require('../../config');
const CookieAdmin = require('./fixtures/cookie-admin');
const CookieAccount = require('./fixtures/cookie-account');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const Async = require('async');
const PrepareData = require('../lab/prepare-data');
const Proxyquire = require('proxyquire');
const stub = {
    get: function (key){

        if ( key === '/db' ){
            key = '/db_test';
        }
        return Config.get(key);
    }
};

const DBSetup = Proxyquire('../../dbsetup', { './config' : stub });

const lab = exports.lab = Lab.script();
let server;
let db;
let sessionFindByCredentials;
let userFindById;
let Session;
let User;
let accountCredentials;
let adminCredentials;
let notRootAdminCredentials;

lab.beforeEach((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                Session = db.models.Session;
                User = db.models.User;
                userFindById = User.findById;
                sessionFindByCredentials = Session.findByCredentials;

                server.initialize(cb);
            });
        }],
        adminUser: ['runServer', function (results, cb){

            Credentials( db, '00000000-0000-0000-0000-000000000000', ( err, iresults ) => {

                if ( err ){
                    return cb(err);
                }
                adminCredentials = iresults;
                cb(null);
            });
        }],
        accountUser: ['runServer', function (results, cb){

            Credentials( db, '11111111-1111-1111-1111-111111111111', ( err, iresults ) => {

                if ( err ){
                    return cb(err);
                }
                accountCredentials = iresults;
                cb(null);
            });
        }],
        notRootAdminUser: ['runServer', function (results, cb){

            Credentials( db, '33333333-3333-3333-3333-333333333333', ( err, iresults ) => {

                if ( err ){
                    return cb(err);
                }
                notRootAdminCredentials = iresults;
                cb(null);
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


lab.afterEach((done) => {

    done();
});


lab.experiment('Auth Plugin', () => {

    lab.test('it returns authentication credentials', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            Session.createNew(accountCredentials.user.id, callback);
        };

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                server.auth.test('session', request, (err, credentials) => {

                    Code.expect(err).to.not.exist();
                    Code.expect(credentials).to.be.an.object();
                    Session.findByCredentials = sessionFindByCredentials;

                    reply('ok');
                });
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            done();
        });
    });

    lab.test('it returns an error when the session is not found', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            callback();
        };

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                server.auth.test('session', request, (err, credentials) => {

                    Code.expect(err).to.be.an.object();
                    Session.findByCredentials = sessionFindByCredentials;

                    reply('ok');
                });
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            done();
        });
    });

    lab.test('it returns an error when the user is not found', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            Session.createNew(accountCredentials.user.id, callback);
        };

        User.findById = function (username) {

            return new Promise( (resolve, reject ) => {

                resolve();
            });
        };

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                server.auth.test('session', request, (err, credentials) => {

                    Code.expect(err).to.be.an.object();
                    Session.findByCredentials = sessionFindByCredentials;
                    User.findById = userFindById;
                    reply('ok');
                });
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            done();
        });
    });


    lab.test('it returns an error when a model error occurs', (done) => {

        Session.findByCredentials = function (username, key, callback) {

            callback(Error('session fail'));
        };

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                server.auth.test('session', request, (err, credentials) => {

                    Code.expect(err).to.be.an.object();
                    Session.findByCredentials = sessionFindByCredentials;

                    reply('ok');
                });
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            done();
        });
    });


    lab.test('it takes over when the required role is missing', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            //todo put a row in the session table to match the cookie
            //instead of making one up here
            Session.createNew(accountCredentials.user.id, callback);
        };
        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: {
                    strategy: 'session',
                    scope: 'admin'
                }
            },
            handler: function (request, reply) {

                Code.expect(request.auth.credentials).to.be.an.object();
                Session.findByCredentials = sessionFindByCredentials;

                reply('ok');
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAccount
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/insufficient scope/i);

            done();
        });
    });

    lab.test('it continues through pre handler when role is present', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            Session.createNew(accountCredentials.user.id, callback);
        };

        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: {
                    strategy: 'session',
                    scope: ['account', 'admin']
                }
            },
            handler: function (request, reply) {

                Code.expect(request.auth.credentials).to.be.an.object();
                Session.findByCredentials = sessionFindByCredentials;

                reply('ok');
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/ok/i);

            done();
        });
    });


    lab.test('it takes over when the required group is missing', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            Session.createNew(adminCredentials.user.id, callback);
        };

        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: {
                    strategy: 'session',
                    scope: 'admin'
                },
                pre: [
                    AuthPlugin.preware.ensureAdminGroup('OtherRoot')
                ]
            },
            handler: function (request, reply) {

                Code.expect(request.auth.credentials).to.be.an.object();
                Session.findByCredentials = sessionFindByCredentials;

                reply('ok');
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/missing admin group membership/i);

            done();
        });
    });


    lab.test('it continues through pre handler when group is present', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            Session.createNew(adminCredentials.user.id, callback);
        };

        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: {
                    strategy: 'session',
                    scope: 'admin'
                },
                pre: [
                    AuthPlugin.preware.ensureAdminGroup(['sales', 'Root'])
                ]
            },
            handler: function (request, reply) {

                Code.expect(request.auth.credentials).to.be.an.object();
                Session.findByCredentials = sessionFindByCredentials;

                reply('ok');
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/ok/i);

            done();
        });
    });


    lab.test('it continues through pre handler when not acting the root user', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            Session.createNew(notRootAdminCredentials.user.id, callback);
        };

        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: {
                    strategy: 'session',
                    scope: 'admin'
                },
                pre: [
                    AuthPlugin.preware.ensureNotRoot
                ]
            },
            handler: function (request, reply) {

                Code.expect(request.auth.credentials).to.be.an.object();
                Session.findByCredentials = sessionFindByCredentials;

                reply('ok');
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAccount
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/ok/i);

            done();
        });
    });


    lab.test('it takes over when acting as the root user', (done) => {

        Session.findByCredentials = function (id, key, callback) {

            Session.createNew(adminCredentials.user.id, callback);
        };

        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: {
                    strategy: 'session',
                    scope: 'admin'
                },
                pre: [
                    AuthPlugin.preware.ensureNotRoot
                ]
            },
            handler: function (request, reply) {

                Code.expect(request.auth.credentials).to.be.an.object();
                Session.findByCredentials = sessionFindByCredentials;

                reply('ok');
            }
        });

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie: CookieAdmin
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/not permitted for root user/i);

            done();
        });
    });
});
