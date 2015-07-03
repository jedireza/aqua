var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Hoek = require('hoek');
var Config = require('../../../config');
var Manifest = require('../../../manifest');
var Hapi = require('hapi');
var HapiAuth = require('hapi-auth-cookie');
var Proxyquire = require('proxyquire');
var AuthPlugin = require('../../../server/auth');
var LogoutPlugin = require('../../../server/api/logout');
var AuthenticatedUser = require('../fixtures/credentials-admin');


var lab = exports.lab = Lab.script();
var ModelsPlugin, request, server, stub;


lab.before(function (done) {

    stub = {
        Session: {}
    };

    var proxy = {};
    proxy[Path.join(process.cwd(), './server/models/session')] = stub.Session;

    ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/plugins')['hapi-mongo-models']
    };

    var plugins = [HapiAuth, ModelsPlugin, AuthPlugin, LogoutPlugin];
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


lab.experiment('Logout Plugin (Delete Session)', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'DELETE',
            url: '/logout',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when delete fails', function (done) {

        stub.Session.findByIdAndDelete = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('delete failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when delete misses (no credentials)', function (done) {

        stub.Session.findByIdAndDelete = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, 0);
        };

        delete request.credentials;

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/session not found/i);

            done();
        });
    });


    lab.test('it returns a not found when delete misses (missing user from credentials)', function (done) {

        stub.Session.findByIdAndDelete = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, 0);
        };

        var CorruptedAuthenticatedUser = Hoek.clone(AuthenticatedUser);
        CorruptedAuthenticatedUser.user = undefined;
        request.credentials = CorruptedAuthenticatedUser;

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/session not found/i);

            done();
        });
    });


    lab.test('it deletes the authenticated user session successfully', function (done) {

        stub.Session.findByIdAndDelete = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, 1);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
