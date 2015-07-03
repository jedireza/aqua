var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Manifest = require('../../../manifest');
var Hapi = require('hapi');
var HapiAuth = require('hapi-auth-cookie');
var Proxyquire = require('proxyquire');
var AuthPlugin = require('../../../server/auth');
var UserPlugin = require('../../../server/api/users');
var AuthenticatedUser = require('../fixtures/credentials-admin');


var lab = exports.lab = Lab.script();
var ModelsPlugin, request, server, stub;


lab.before(function (done) {

    stub = {
        User: {}
    };

    var proxy = {};
    proxy[Path.join(process.cwd(), './server/models/user')] = stub.User;

    ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/plugins')['hapi-mongo-models']
    };

    var plugins = [HapiAuth, ModelsPlugin, AuthPlugin, UserPlugin];
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


lab.experiment('User Plugin Result List', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/users',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when paged find fails', function (done) {

        stub.User.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an array of documents successfully', function (done) {

        stub.User.pagedFind = function () {

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


    lab.test('it returns an array of documents successfully using filters', function (done) {

        stub.User.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url = '/users?username=ren&isActive=true&role=admin&limit=10&page=1';

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Users Plugin Read', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/users/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find by id fails', function (done) {

        stub.User.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', function (done) {

        stub.User.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', function (done) {

        stub.User.findById = function (id, callback) {

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Users Plugin (My) Read', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/users/my',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find by id fails', function (done) {

        stub.User.findById = function () {

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

        stub.User.findById = function () {

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

        stub.User.findById = function () {

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


lab.experiment('Users Plugin Create', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'POST',
            url: '/users',
            payload: {
                username: 'muddy',
                password: 'dirtandwater',
                email: 'mrmud@mudmail.mud'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find one fails for username check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.username) {
                callback(Error('find one failed'));
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for username check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.username) {
                callback(null, {});
            }
            else {
                callback(Error('find one failed'));
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when find one fails for email check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.email) {
                callback(Error('find one failed'));
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for email check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.email) {
                callback(null, {});
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when create fails', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.create = function (username, password, email, callback) {

            callback(Error('create failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it creates a document successfully', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.create = function (username, password, email, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Users Plugin Update', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/users/420000000000000000000000',
            payload: {
                isActive: true,
                username: 'muddy',
                email: 'mrmud@mudmail.mud'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find one fails for username check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.username) {
                callback(Error('find one failed'));
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for username check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.username) {
                callback(null, {});
            }
            else {
                callback(Error('find one failed'));
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when find one fails for email check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.email) {
                callback(Error('find one failed'));
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for email check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.email) {
                callback(null, {});
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when find by id misses', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, undefined);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Users Plugin (My) Update', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/users/my',
            payload: {
                username: 'muddy',
                email: 'mrmud@mudmail.mud'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find one fails for username check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.username) {
                callback(Error('find one failed'));
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for username check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.username) {
                callback(null, {});
            }
            else {
                callback(Error('find one failed'));
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when find one fails for email check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.email) {
                callback(Error('find one failed'));
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for email check', function (done) {

        stub.User.findOne = function (conditions, callback) {

            if (conditions.email) {
                callback(null, {});
            }
            else {
                callback();
            }
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.findByIdAndUpdate = function () {

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

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.findByIdAndUpdate = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { _id: '1D', username: 'muddy' });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Users Plugin Set Password', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/users/420000000000000000000000/password',
            payload: {
                password: 'fromdirt'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when generate password hash fails', function (done) {

        stub.User.generatePasswordHash = function (password, callback) {

            callback(Error('generate password hash failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.User.generatePasswordHash = function (password, callback) {

            callback(null, { password: '', hash: '' });
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it sets the password successfully', function (done) {

        stub.User.generatePasswordHash = function (password, callback) {

            callback(null, { password: '', hash: '' });
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Users Plugin (My) Set Password', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/users/my/password',
            payload: {
                password: 'fromdirt'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when generate password hash fails', function (done) {

        stub.User.generatePasswordHash = function (password, callback) {

            callback(Error('generate password hash failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.User.generatePasswordHash = function (password, callback) {

            callback(null, { password: '', hash: '' });
        };

        stub.User.findByIdAndUpdate = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it sets the password successfully', function (done) {

        stub.User.generatePasswordHash = function (password, callback) {

            callback(null, { password: '', hash: '' });
        };

        stub.User.findByIdAndUpdate = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Users Plugin Delete', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'DELETE',
            url: '/users/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', function (done) {

        stub.User.findByIdAndDelete = function (id, callback) {

            callback(Error('delete by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', function (done) {

        stub.User.findByIdAndDelete = function (id, callback) {

            callback(null, undefined);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it deletes a document successfully', function (done) {

        stub.User.findByIdAndDelete = function (id, callback) {

            callback(null, 1);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
