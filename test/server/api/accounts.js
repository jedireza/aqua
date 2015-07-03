var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Manifest = require('../../../manifest');
var Hapi = require('hapi');
var HapiAuth = require('hapi-auth-cookie');
var Proxyquire = require('proxyquire');
var AuthPlugin = require('../../../server/auth');
var AccountPlugin = require('../../../server/api/accounts');
var AuthenticatedAdmin = require('../fixtures/credentials-admin');
var AuthenticatedAccount = require('../fixtures/credentials-account');


var lab = exports.lab = Lab.script();
var ModelsPlugin, request, server, stub;


lab.before(function (done) {

    stub = {
        Account: {},
        Status: {},
        User: {}
    };

    var proxy = {};
    proxy[Path.join(process.cwd(), './server/models/account')] = stub.Account;
    proxy[Path.join(process.cwd(), './server/models/status')] = stub.Status;
    proxy[Path.join(process.cwd(), './server/models/user')] = stub.User;

    ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/plugins')['hapi-mongo-models']
    };

    var plugins = [HapiAuth, ModelsPlugin, AuthPlugin, AccountPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, function (err) {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.after(function (done) {

    server.plugins['hapi-mongo-models'].BaseModel.disconnect();
    done();
});


lab.experiment('Accounts Plugin Result List', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/accounts',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when paged find fails', function (done) {

        stub.Account.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it returns an array of documents successfully using filters', function (done) {

        stub.Account.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url = '/accounts?username=stimpy';

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an array of documents successfully', function (done) {

        stub.Account.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin Read', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/accounts/93EP150D35',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when find by id fails', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', function (done) {

        stub.Account.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin (My) Read', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/accounts/my',
            credentials: AuthenticatedAccount
        };

        done();
    });


    lab.test('it returns an error when find by id fails', function (done) {

        stub.Account.findById = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', function (done) {

        stub.Account.findById = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', function (done) {

        stub.Account.findById = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin Create', function () {

    lab.beforeEach(function (done) {

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


    lab.test('it returns an error when create fails', function (done) {

        stub.Account.create = function (name, callback) {

            callback(Error('create failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it creates a document successfully', function (done) {

        stub.Account.create = function (name, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin Update', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/accounts/93EP150D35',
            payload: {
                nameFirst: 'Muddy',
                nameLast: 'Mudskipper'
            },
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when find by id misses', function (done) {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, undefined);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin (My) Update', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/accounts/my',
            payload: {
                nameFirst: 'Mud',
                nameLast: 'Skipper'
            },
            credentials: AuthenticatedAccount
        };

        done();
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.Account.findByIdAndUpdate = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.Account.findByIdAndUpdate = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Accounts Plugin Link User', function () {

    lab.beforeEach(function (done) {

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


    lab.test('it returns an error when (Account) find by id fails', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it returns not found when (Account) find by id misses', function (done) {

        stub.Account.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns an error when (User) find by username fails', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback(Error('find by username failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns conflict when an account role already exists', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            var user = {
                roles: {
                    account: {
                        id: '535H0W35',
                        name: 'Stimpson J Cat'
                    }
                }
            };

            callback(null, user);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns conflict when the account is linked to another user', function (done) {

        stub.Account.findById = function (id, callback) {

            var account = {
                _id: 'DUD3N0T1T',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, account);
        };

        stub.User.findByUsername = function (id, callback) {

            var user = {
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

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', function (done) {

        stub.Account.findById = function (id, callback) {

            var account = {
                _id: '93EP150D35',
                name: {
                    first: 'Ren',
                    last: 'Höek'
                }
            };

            callback(null, account);
        };

        stub.User.findByUsername = function (id, callback) {

            var user = {
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

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfuly links an account and user', function (done) {

        var account = {
            _id: '93EP150D35',
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        };
        var user = {
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

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Accounts Plugin Add Note', function () {

    lab.beforeEach(function (done) {

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


    lab.test('it returns an error when find by id and update fails', function (done) {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully adds a note', function (done) {

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Accounts Plugin Update Status', function () {

    lab.beforeEach(function (done) {

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


    lab.test('it returns an error when find by id (Status) fails', function (done) {

        stub.Status.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', function (done) {

        stub.Status.findById = function (id, callback) {

            callback(null, { _id: 'account-happy', name: 'Happy' });
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully updates the status', function (done) {

        stub.Status.findById = function (id, callback) {

            callback(null, { _id: 'account-happy', name: 'Happy' });
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Accounts Plugin Unlink User', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'DELETE',
            url: '/accounts/93EP150D35/user',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when (Account) find by id fails', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (Account) find by id misses', function (done) {

        stub.Account.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns early account is void of a user', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns early account is void of a user.id', function (done) {

        stub.Account.findById = function (id, callback) {

            callback(null, { user: {} });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns an error when (User) find by id fails', function (done) {

        stub.Account.findById = function (id, callback) {

            var account = {
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

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', function (done) {

        stub.Account.findById = function (id, callback) {

            var account = {
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

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);

            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', function (done) {

        stub.Account.findById = function (id, callback) {

            var account = {
                _id: '93EP150D35',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, account);
        };

        stub.User.findById = function (id, callback) {

            var user = {
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

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully unlinks an account from a user', function (done) {

        var user = {
            _id: '535H0W35',
            roles: {
                account: {
                    id: '93EP150D35',
                    name: 'Ren Höek'
                }
            }
        };
        var account = {
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

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Accounts Plugin Delete', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'DELETE',
            url: '/accounts/93EP150D35',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', function (done) {

        stub.Account.findByIdAndDelete = function (id, callback) {

            callback(Error('delete by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', function (done) {

        stub.Account.findByIdAndDelete = function (id, callback) {

            callback(null, undefined);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it deletes a document successfully', function (done) {

        stub.Account.findByIdAndDelete = function (id, callback) {

            callback(null, 1);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
