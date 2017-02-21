'use strict';
const AuthPlugin = require('../../../server/auth');
const AccountPlugin = require('../../../server/web/account/index');
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

lab.experiment('Account Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/account',
            credentials: accountCredentials
        };

        done();
    });


    lab.test('Account page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/account/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
