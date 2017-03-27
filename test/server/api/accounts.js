'use strict';
const AccountPlugin = require('../../../server/api/accounts');
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
        //todo is there a way to access the original function?
        //without loading ConfigOriginal
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
let Account;
let User;
let Status;
let StatusEntry;
let NoteEntry;
let accountFindById;
let accountFindOne;
let accountPagedFind;
let accountCreate;
let accountUpdate;
let accountDestroy;
let userFindOne;
let noteEntryCreate;
let statusFindById;
let statusEntryCreate;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, AccountPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                Account = db.models.Account;
                User = db.models.User;
                Status = db.models.Status;
                StatusEntry = db.models.StatusEntry;
                NoteEntry = db.models.NoteEntry;
                accountFindById = Account.findById;
                accountCreate = Account.findCreate;
                accountFindOne = Account.findOne;
                accountUpdate = Account.update;
                accountDestroy = Account.destroy;
                userFindOne = User.findOne;
                noteEntryCreate = NoteEntry.create;
                statusEntryCreate = StatusEntry.create;
                statusFindById = Status.findById;
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
lab.experiment('Accounts Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/accounts',
            credentials: adminCredentials
        };

        done();
    });

    lab.test('it returns an error when paged find fails', (done) => {

        Account.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.pagedFind = accountPagedFind;
            done();
        });
    });

    lab.test('it returns an array of documents successfully', (done) => {

        Account.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            Account.pagedFind = accountPagedFind;

            done();
        });
    });

    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        Account.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?username=ren';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            Account.pagedFind = accountPagedFind;

            done();
        });
    });

});

lab.experiment('Accounts Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/accounts/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        Account.findById = function (id, options) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findById = accountFindById;
            done();
        });
    });

    lab.test('it returns a not found when find by id misses', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            Account.findById = accountFindById;

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({ id: '93EP150D35' });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Account.findById = accountFindById;

            done();
        });
    });
});

lab.experiment('Accounts Plugin (My) Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/accounts/my',
            credentials: accountCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        Account.findOne = function () {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findOne = accountFindOne;
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        Account.findOne = function () {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            Account.findOne = accountFindOne;

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        Account.findOne = function () {

            return new Promise( (resolve, reject) => {

                resolve({ id: '93EP150D35' });
            });

        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Account.findOne = accountFindOne;

            done();
        });
    });
});


lab.experiment('Accounts Plugin Create', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/accounts',
            payload: {
                name: 'Muddy Mudskipper'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when create fails', (done) => {

        Account.create = function (name, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('create failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.create = accountCreate;
            done();
        });
    });


    lab.test('it creates a document successfully', (done) => {

        Account.create = function (name, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Account.create = accountCreate;

            done();
        });
    });
});


lab.experiment('Accounts Plugin Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/accounts/93EP150D35',
            payload: {
                first: 'Muddy',
                last: 'Mudskipper'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        Account.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.update = accountUpdate;
            done();
        });
    });


    lab.test('it returns not found when find by id misses', (done) => {

        Account.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Account.update = accountUpdate;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        Account.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Account.update = accountUpdate;

            done();
        });
    });
});


lab.experiment('Accounts Plugin (My) Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/accounts/my',
            payload: {
                first: 'Mud',
                last: 'Skipper'
            },
            credentials: accountCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        Account.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.update = accountUpdate;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        Account.update = function () {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Account.update = accountUpdate;

            done();
        });
    });
});


lab.experiment('Accounts Plugin Link User', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/accounts/93EP150D35/user',
            payload: {
                username: 'ren'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when (Account) find by id fails', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findById = accountFindById;

            done();
        });
    });


    lab.test('it returns not found when (Account) find by id misses', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Account.findById = accountFindById;
            done();
        });
    });

    lab.test('it returns an error when (User) find by username fails', (done) => {

        Account.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );
            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by username failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findById = accountFindById;
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', (done) => {

        Account.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );

            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Account.findById = accountFindById;
            User.findOne = userFindOne;
            done();
        });
    });

    lab.test('it returns conflict when an account role already exists', (done) => {

        Account.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );

            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getAccount: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve({});

                            });
                        }
                    }
                );
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            Account.findById = accountFindById;
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns conflict when the account is linked to another user', (done) => {

        Account.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve({});

                            });
                        }
                    }
                );
            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getAccount: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            Account.findById = accountFindById;
            User.findOne = userFindOne;
            done();
        });
    });

    lab.test('it returns an error when find by id and update fails', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '93EP150D35',
                        first: 'Ren',
                        last: 'Höek',
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        },
                        setUser: () => {

                            return new Promise( (inner_resolve, inner_reject) => {

                                inner_reject(Error('find by id and update failed'));
                            });

                        }

                    }
                );
            });
        };

        User.findOne = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '535H0W35',
                        username: 'ren',
                        getAccount: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findById = accountFindById;
            User.findOne = userFindOne;
            done();
        });
    });

    lab.test('it successfuly links an account and user', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '93EP150D35',
                        first: 'Ren',
                        last: 'Höek',
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();
                            });
                        },
                        setUser: () => {

                            return new Promise( (inner_resolve, inner_reject) => {

                                inner_resolve({});
                            });
                        }
                    }
                );
            });
        };

        User.findOne = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '535H0W35',
                        username: 'ren',
                        getAccount: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Account.findById = accountFindById;
            User.findOne = userFindOne;
            done();
        });
    });
});

lab.experiment('Accounts Plugin Add Note', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/accounts/93EP150D35/notes',
            payload: {
                data: 'This is a wonderful note.'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        Account.findById = function (id, options) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findById = accountFindById;
            done();
        });
    });


    lab.test('it successfully adds a note', (done) => {

        Account.findById = function (id, options) {

            return new Promise( (resolve, reject) => {

                resolve({
                    createNoteEntry : function (obj) {

                        return new Promise( (iresolve, ireject) => {

                            iresolve(obj);
                        });
                    },
                    reload : function () {

                        return new Promise( (iresolve, ireject) => {

                            iresolve({});
                        });
                    }
                });
            });
        };
        NoteEntry.create = function (note) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Account.findById = accountFindById;
            NoteEntry.create = noteEntryCreate;
            done();
        });
    });
});

lab.experiment('Accounts Plugin Update Status', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/accounts/93EP150D35/status',
            payload: {
                status: 'account-happy'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id (Status) fails', (done) => {

        Status.findById = function (id, options) {

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

    lab.test('it returns an error when find by id and update fails', (done) => {

        Status.findById = function (id, options) {

            return new Promise( (resolve, reject) => {

                resolve({ id: 'account-happy', name: 'Happy' });
            });
        };

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        StatusEntry.create = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('create failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Status.findById = statusFindById;
            Account.findById = accountFindById;
            Account.create = statusEntryCreate;
            done();
        });
    });

    lab.test('it successfully updates the status', (done) => {

        Status.findById = function (id, options) {

            return new Promise( (resolve, reject) => {

                resolve({ id: 'account-happy', name: 'Happy' });
            });
        };

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        StatusEntry.create = function (note) {

            return new Promise( (resolve, reject) => {

                resolve({});

            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Status.findById = statusFindById;
            Account.findById = accountFindById;
            StatusEntry.create = statusEntryCreate;
            done();
        });
    });
});
lab.experiment('Accounts Plugin Unlink User', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/accounts/93EP150D35/user',
            credentials: adminCredentials
        };

        done();
    });

    lab.test('it returns an error when (Account) find by id fails', (done) => {

        Account.findById = function (id, options) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findById = accountFindById;
            done();
        });
    });


    lab.test('it returns not found when (Account) find by id misses', (done) => {

        Account.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Account.findById = accountFindById;
            done();
        });
    });

    lab.test('it returns early account is void of a user', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    setUser: function (user){

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve({});
                        });
                    },
                    getUser: function () {

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve();
                        });
                    }
                });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Account.findById = accountFindById;
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    setUser: function (user){

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_reject(Error('update failed'));
                        });
                    },
                    getUser: function () {

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve({});
                        });
                    }
                });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.findById = accountFindById;
            done();
        });
    });


    lab.test('it successfully unlinks an account from a user', (done) => {

        Account.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    setUser: function (user){

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve();
                        });
                    },
                    getUser: function () {

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve({});
                        });
                    }
                });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Account.findById = accountFindById;
            done();
        });
    });
});

lab.experiment('Accounts Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/accounts/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        Account.destroy = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                reject(Error('delete by id failed'));
            });

        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Account.destroy = accountDestroy;
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        Account.destroy = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                resolve(0);
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);
            Account.destroy = accountDestroy;

            done();
        });
    });

    lab.test('it deletes a document successfully', (done) => {

        /*
        Account.findByIdAndDelete = function (id, callback) {

            callback(null, 1);
        };*/
        Account.destroy = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                resolve({ message: 'success' } );
            });

        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
