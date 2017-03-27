'use strict';
const AuthPlugin = require('../../../server/auth');
const Credentials = require('../fixtures/credentials');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const UserPlugin = require('../../../server/api/users');
const Lab = require('lab');
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
let adminCredentials;
let accountCredentials;
let db;
let User;
let userPagedFind;
let userFindById;
let userFindOne;
let userUpdate;
let userDestroy;
let userCreate;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, UserPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                User = db.models.User;
                userFindOne = User.findOne;
                userFindById = User.findById;
                userPagedFind = User.pagedFind;
                userUpdate = User.update;
                userDestroy = User.destroy;
                userCreate = User.create;
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

lab.after((done) => {

    done();
});


lab.experiment('User Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/users',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        User.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.pagedFind = userPagedFind;
            done();
        });
    });


    lab.test('it returns an array of documents successfully', (done) => {

        User.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            User.pagedFind = userPagedFind;

            done();
        });
    });


    lab.test('it returns an array of documents successfully using filters', (done) => {

        User.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url = '/users?username=ren&isActive=true&role=admin&limit=10&page=1';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            User.pagedFind = userPagedFind;

            done();
        });
    });
});


lab.experiment('Users Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/users/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        User.findById = function (id) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findById = userFindById;
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        User.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/user not found/i);
            User.findById = userFindById;

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        User.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve({ id: '93EP150D35' });
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            User.findById = userFindById;

            done();
        });
    });
});


lab.experiment('Users Plugin (My) Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/users/my',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        User.findById = function (id) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findById = userFindById;
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        User.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/User not found/i);
            User.findById = userFindById;

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        User.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve( { id: '93EP150D35' } );
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            User.findById = userFindById;

            done();
        });
    });
});


lab.experiment('Users Plugin Create', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/users',
            payload: {
                username: 'muddy',
                password: 'dirtandwater',
                email: 'mrmud@mudmail.mud'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find one fails for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    resolve({});
                }
                else {
                    reject(Error('find one failed'));
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns an error when find one fails for email check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.email) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for email check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.email) {
                    resolve({});
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.create = function (username, password, email, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('create failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            User.create = userCreate;
            done();
        });
    });


    lab.test('it creates a document successfully', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.create = function (username, password, email, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            User.findOne = userFindOne;
            User.create = userCreate;

            done();
        });
    });
});


lab.experiment('Users Plugin Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/users/420000000000000000000000',
            payload: {
                isActive: true,
                username: 'muddy',
                email: 'mrmud@mudmail.mud'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find one fails for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    resolve({});
                }
                else {
                    reject(Error('find one failed'));
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns an error when find one fails for email check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.email) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for email check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.email) {
                    resolve({});
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns an error when update fails', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.update = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            User.update = userUpdate;
            done();
        });
    });


    lab.test('it returns not found when find by id misses', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.update = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(0);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            User.findOne = userFindOne;
            User.update = userUpdate;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.update = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.a.number();
            User.findOne = userFindOne;
            User.update = userUpdate;

            done();
        });
    });
});


lab.experiment('Users Plugin (My) Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/users/my',
            payload: {
                username: 'muddy',
                email: 'mrmud@mudmail.mud'
            },
            credentials: accountCredentials
        };

        done();
    });


    lab.test('it returns an error when find one fails for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;

            done();
        });
    });


    lab.test('it returns a conflict when find one hits for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    resolve({});
                }
                else {
                    reject(Error('find one failed'));
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;

            done();
        });
    });


    lab.test('it returns an error when find one fails for email check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;

            done();
        });
    });


    lab.test('it returns a conflict when find one hits for email check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.email) {
                    resolve({});
                }
                else {
                    resolve();
                }
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;

            done();
        });
    });


    lab.test('it returns an error when update fails', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.update = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            User.update = userUpdate;

            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.update = function (options) {

            return new Promise( (resolve, reject) => {

                resolve({ id: '1D', username: 'muddy' });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            User.findOne = userFindOne;

            done();
        });
    });
});


lab.experiment('Users Plugin Set Password', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/users/420000000000000000000000/password',
            payload: {
                password: 'fromdirt'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        User.update = function (options, where) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.update = userUpdate;
            done();
        });
    });


    lab.test('it sets the password successfully', (done) => {

        User.update = function (options, where) {

            return new Promise( (resolve, reject) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            User.update = userUpdate;
            done();
        });
    });
});


lab.experiment('Users Plugin (My) Set Password', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/users/my/password',
            payload: {
                password: 'fromdirt'
            },
            credentials: accountCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        User.update = function (options, where) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.update = userUpdate;
            done();
        });
    });


    lab.test('it sets the password successfully', (done) => {

        User.update = function (options, where) {

            return new Promise( (resolve, reject) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            User.update = userUpdate;
            done();
        });
    });
});


lab.experiment('Users Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/users/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        User.destroy = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('delete by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.destroy = userDestroy;
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        User.destroy = function (options) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            User.destroy = userDestroy;

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        User.destroy = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);
            User.destroy = userDestroy;

            done();
        });
    });
});
