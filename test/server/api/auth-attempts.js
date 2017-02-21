'use strict';
const AuthAttemptPlugin = require('../../../server/api/auth-attempts');
const AuthPlugin = require('../../../server/auth');
const Credentials = require('../fixtures/credentials');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
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
let AuthAttempt;
let authAttemptFindById;
let authAttemptPagedFind;
let authAttemptDestroy;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, AuthAttemptPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                AuthAttempt = db.models.AuthAttempt;
                authAttemptFindById = AuthAttempt.findById;
                authAttemptDestroy = AuthAttempt.destory;
                authAttemptPagedFind = AuthAttempt.pagedFind;
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


lab.experiment('Auth Attempts Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/auth-attempts',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        AuthAttempt.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AuthAttempt.pagedFind = authAttemptPagedFind;
            done();
        });
    });


    lab.test('it returns an array of documents successfully', (done) => {

        AuthAttempt.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            AuthAttempt.pagedFind = authAttemptPagedFind;

            done();
        });
    });
});


lab.experiment('Auth Attempts Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/auth-attempts/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        AuthAttempt.findById = function (id) {

            return new Promise( (resolve, reject ) => {

                reject(Error('find by id failed'));
            });

        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AuthAttempt.findById = authAttemptFindById;
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        AuthAttempt.findById = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            AuthAttempt.findById = authAttemptFindById;

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        AuthAttempt.findById = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                resolve({ id: '93EP150D35' });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            AuthAttempt.findById = authAttemptFindById;

            done();
        });
    });
});


lab.experiment('Auth Attempt Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/auth-attempts/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        AuthAttempt.destroy = function (options) {

            return new Promise( (resolve, reject ) => {

                reject(Error('delete by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AuthAttempt.destroy = authAttemptDestroy;
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        AuthAttempt.destroy = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve(0);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            AuthAttempt.destroy = authAttemptDestroy;

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        AuthAttempt.destroy = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);
            AuthAttempt.destroy = authAttemptDestroy;

            done();
        });
    });
});
