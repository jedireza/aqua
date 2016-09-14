'use strict';
const AccountPlugin = require('../../../server/api/accounts');
const AuthPlugin = require('../../../server/auth');
const AuthenticatedAccount = require('../fixtures/credentials-account');
const AuthenticatedAdmin = require('../fixtures/credentials-admin');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const MakeMockModel = require('../fixtures/make-mock-model');
const Manifest = require('../../../manifest');
const Path = require('path');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
let request;
let server;
let stub;


lab.before((done) => {

    stub = {
        Account: MakeMockModel(),
        Status: MakeMockModel(),
        User: MakeMockModel()
    };

    const proxy = {};
    proxy[Path.join(process.cwd(), './server/models/account')] = stub.Account;
    proxy[Path.join(process.cwd(), './server/models/status')] = stub.Status;
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

    const plugins = [HapiAuth, ModelsPlugin, AuthPlugin, AccountPlugin];
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


lab.experiment('Accounts Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/accounts',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        stub.Account.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an array of documents successfully', (done) => {

        stub.Account.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        stub.Account.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?username=ren';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/accounts/93EP150D35',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        stub.Account.findById = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin (My) Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/accounts/my',
            credentials: AuthenticatedAccount
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        stub.Account.findById = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        stub.Account.findById = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        stub.Account.findById = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

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
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when create fails', (done) => {

        stub.Account.create = function (name, callback) {

            callback(Error('create failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it creates a document successfully', (done) => {

        stub.Account.create = function (name, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

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
                name: {
                    first: 'Muddy',
                    last: 'Mudskipper'
                }
            },
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when find by id misses', (done) => {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, undefined);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

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
                name: {
                    first: 'Mud',
                    last: 'Skipper'
                }
            },
            credentials: AuthenticatedAccount
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        stub.Account.findByIdAndUpdate = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        stub.Account.findByIdAndUpdate = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

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
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when (Account) find by id fails', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it returns not found when (Account) find by id misses', (done) => {

        stub.Account.findById = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns an error when (User) find by username fails', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback(Error('find by username failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns conflict when an account role already exists', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            const user = {
                roles: {
                    account: {
                        id: '535H0W35',
                        name: 'Stimpson J Cat'
                    }
                }
            };

            callback(null, user);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns conflict when the account is linked to another user', (done) => {

        stub.Account.findById = function (id, callback) {

            const account = {
                _id: 'DUD3N0T1T',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, account);
        };

        stub.User.findByUsername = function (id, callback) {

            const user = {
                _id: 'N0T1TDUD3',
                roles: {
                    account: {
                        id: '93EP150D35',
                        name: 'Ren Höek'
                    }
                }
            };

            callback(null, user);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        stub.Account.findById = function (id, callback) {

            const account = {
                _id: '93EP150D35',
                name: {
                    first: 'Ren',
                    last: 'Höek'
                }
            };

            callback(null, account);
        };

        stub.User.findByUsername = function (id, callback) {

            const user = {
                _id: '535H0W35',
                username: 'ren'
            };

            callback(null, user);
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfuly links an account and user', (done) => {

        const account = {
            _id: '93EP150D35',
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        };
        const user = {
            _id: '535H0W35',
            username: 'ren',
            roles: {}
        };

        stub.Account.findById = function (id, callback) {

            callback(null, account);
        };

        stub.User.findByUsername = function (id, callback) {

            callback(null, user);
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, account);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, user);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
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
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully adds a note', (done) => {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
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
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when find by id (Status) fails', (done) => {

        stub.Status.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        stub.Status.findById = function (id, callback) {

            callback(null, { _id: 'account-happy', name: 'Happy' });
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully updates the status', (done) => {

        stub.Status.findById = function (id, callback) {

            callback(null, { _id: 'account-happy', name: 'Happy' });
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Accounts Plugin Unlink User', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/accounts/93EP150D35/user',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when (Account) find by id fails', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (Account) find by id misses', (done) => {

        stub.Account.findById = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns early account is void of a user', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns early account is void of a user.id', (done) => {

        stub.Account.findById = function (id, callback) {

            callback(null, { user: {} });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns an error when (User) find by id fails', (done) => {

        stub.Account.findById = function (id, callback) {

            const account = {
                user: {
                    id: '93EP150D35',
                    name: 'ren'
                }
            };

            callback(null, account);
        };

        stub.User.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', (done) => {

        stub.Account.findById = function (id, callback) {

            const account = {
                user: {
                    id: '93EP150D35',
                    name: 'ren'
                }
            };

            callback(null, account);
        };

        stub.User.findById = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);

            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        stub.Account.findById = function (id, callback) {

            const account = {
                _id: '93EP150D35',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, account);
        };

        stub.User.findById = function (id, callback) {

            const user = {
                _id: '535H0W35',
                roles: {
                    account: {
                        id: '93EP150D35',
                        name: 'Ren Höek'
                    }
                }
            };

            callback(null, user);
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully unlinks an account from a user', (done) => {

        const user = {
            _id: '535H0W35',
            roles: {
                account: {
                    id: '93EP150D35',
                    name: 'Ren Höek'
                }
            }
        };
        const account = {
            _id: '93EP150D35',
            user: {
                id: '535H0W35',
                name: 'ren'
            }
        };

        stub.Account.findById = function (id, callback) {

            callback(null, account);
        };

        stub.User.findById = function (id, callback) {

            callback(null, user);
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, account);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, user);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Accounts Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/accounts/93EP150D35',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        stub.Account.findByIdAndDelete = function (id, callback) {

            callback(Error('delete by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        stub.Account.findByIdAndDelete = function (id, callback) {

            callback(null, undefined);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        stub.Account.findByIdAndDelete = function (id, callback) {

            callback(null, 1);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
