'use strict';
const AuthPlugin = require('../../../server/auth');
const Credentials = require('../fixtures/credentials');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const StatusesPlugin = require('../../../server/api/statuses');
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

/*
todo: will need sql script with admin perms on the db to set up db name and user
learned that hapi-sequelize registration was missing next in the correct spot
probably can go through all api handlers and move the models out to the set up scope
instead of the handler scope
*/
const lab = exports.lab = Lab.script();
let request;
let server;
let adminCredentials;
let db;
let Status;
let statusFindById;
let statusCreate;
let statusUpdate;
let statusDestroy;
let statusPagedFind;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, StatusesPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                Status = db.models.Status;
                statusCreate = Status.create;
                statusFindById = Status.findById;
                statusPagedFind = Status.pagedFind;
                statusUpdate = Status.update;
                statusDestroy = Status.destroy;
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


lab.experiment('Statuses Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/statuses',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        Status.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Status.pagedFind = statusPagedFind;
            done();
        });
    });


    lab.test('it returns an array of documents successfully', (done) => {

        Status.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            Status.pagedFind = statusPagedFind;

            done();
        });
    });


    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        Status.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?pivot=Account&name=Happy';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            Status.pagedFind = statusPagedFind;

            done();
        });
    });
});


lab.experiment('Statuses Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/statuses/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        Status.findById = function (id) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Status.findById = statusFindById;
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        Status.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            Status.findById = statusFindById;

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        Status.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve( { id: '93EP150D35' });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Status.findById = statusFindById;

            done();
        });
    });
});


lab.experiment('Statuses Plugin Create', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/statuses',
            payload: {
                pivot: 'Account',
                name: 'Happy'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when create fails', (done) => {

        Status.create = function (pivot, name) {

            return new Promise( (resolve, reject) => {

                reject(Error('create failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Status.create = statusCreate;
            done();
        });
    });


    lab.test('it creates a document successfully', (done) => {

        Status.create = function (pivot, name) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Status.create = statusCreate;

            done();
        });
    });
});


lab.experiment('Statuses Plugin Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/statuses/account-happy',
            payload: {
                name: 'Happy'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        Status.update = function (update, where) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Status.update = statusUpdate;
            done();
        });
    });


    lab.test('it returns not found when find by id misses', (done) => {

        Status.update = function (update, where) {

            return new Promise( (resolve, reject) => {

                resolve(0);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Status.update = statusUpdate;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        Status.update = function (update, where) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Status.update = statusUpdate;

            done();
        });
    });
});


lab.experiment('Statuses Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/statuses/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        Status.destroy = function (id) {

            return new Promise( (resolve, reject) => {

                reject(Error('delete by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Status.destroy = statusDestroy;
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        Status.destroy = function (id) {

            return new Promise( (resolve, reject) => {

                resolve(0);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            Status.destroy = statusDestroy;

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        Status.destroy = function (id) {

            return new Promise( (resolve, reject) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);
            Status.destroy = statusDestroy;

            done();
        });
    });
});
