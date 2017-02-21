'use strict';
const AuthPlugin = require('../../../server/auth');
const AccountPlugin = require('../../../server/api/accounts');
const Credentials = require('../fixtures/credentials');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const LoginPlugin = require('../../../server/web/login/index');
const Path = require('path');
const Vision = require('vision');
const Async = require('async');
const PrepareData = require('../../lab/prepare-data');
const Proxyquire = require('proxyquire');
const stub = {
    get: function (key){

        if ( key === '/db' ){
            key = '/db_test';
        }
        return Config.get(key);
    }
};

const DBSetup = Proxyquire('../../../dbsetup', { './config' : stub });

const lab = exports.lab = Lab.script();
let request;
let server;
let db;
let accountCredentials;
let adminCredentials;

lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [Vision, DBSetup, HapiAuth, AuthPlugin, AccountPlugin, LoginPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                server.views({
                    engines: { jsx: require('hapi-react-views') },
                    path: './server/web',
                    relativeTo: Path.join(__dirname, '..', '..', '..')
                });

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                server.initialize(cb);
            });
        }],
        adminUser: ['runServer', function (results, cb){

            Credentials( db, '00000000-0000-0000-0000-000000000000', ( err, iresults ) => {

                if ( err ){
                    cb(err);
                }
                adminCredentials = iresults;
                cb(null);
            });
        }],
        accountUser: ['runServer', function (results, cb){

            Credentials( db, '11111111-1111-1111-1111-111111111111', ( err, iresults ) => {

                if ( err ){
                    cb(err);
                }
                accountCredentials = iresults;
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


lab.experiment('Login Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/login'
        };

        done();
    });


    lab.test('it renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/Sign In/i);
            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it redirects to /admin when user is authenticated as an admin', (done) => {

        request.credentials = adminCredentials;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });


    lab.test('it redirects to /account when user is authenticated as an account', (done) => {

        request.credentials = accountCredentials;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });


    lab.test('it does not redirect when user is authenticated if the path is logout', (done) => {

        request.url += '/logout';
        request.credentials = accountCredentials;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});
