'use strict';
const AdminPlugin = require('../../../server/web/admin/index');
const AuthPlugin = require('../../../server/auth');
const Credentials = require('../fixtures/credentials');
const LoginPlugin = require('../../../server/web/login/index');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Vision = require('vision');
const Lab = require('lab');
const Path = require('path');
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
let adminCredentials;

lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [Vision, DBSetup, HapiAuth, AuthPlugin, AdminPlugin, LoginPlugin];
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

lab.experiment('Admin Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admin',
            credentials: adminCredentials
        };

        done();
    });

    lab.test('Admin page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/admin/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
