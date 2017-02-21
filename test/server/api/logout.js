'use strict';
const AuthPlugin = require('../../../server/auth');
const Credentials = require('../fixtures/credentials');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Hoek = require('hoek');
const Lab = require('lab');
const LogoutPlugin = require('../../../server/api/logout');
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

const lab = exports.lab = Lab.script();
let request;
let server;
let adminCredentials;
let db;
let Session;
let sessionDestroy;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, LogoutPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                Session = db.models.Session;
                sessionDestroy = Session.destroy;
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

lab.after((done) => {

    done();
});


lab.experiment('Logout Plugin (Delete Session)', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/logout',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when delete fails', (done) => {

        Session.destroy = function (option) {

            return new Promise( (resolve, reject ) => {

                reject(Error('delete failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Session.destroy = sessionDestroy;
            done();
        });
    });


    lab.test('it returns a not found when delete misses (no credentials)', (done) => {

        Session.destroy = function (option) {

            return new Promise( (resolve, reject ) => {

                resolve(0);
            });
        };

        delete request.credentials;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            Session.destroy = sessionDestroy;

            done();
        });
    });


    lab.test('it returns a not found when delete misses (missing user from credentials)', (done) => {

        Session.destroy = function (option) {

            return new Promise( (resolve, reject ) => {

                resolve(0);
            });
        };

        const CorruptedAuthenticatedUser = Hoek.clone(adminCredentials);
        CorruptedAuthenticatedUser.user = undefined;
        request.credentials = CorruptedAuthenticatedUser;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            Session.destroy = sessionDestroy;

            done();
        });
    });


    lab.test('it deletes the authenticated user session successfully', (done) => {

        Session.destroy = function (option) {

            return new Promise( (resolve, reject ) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
