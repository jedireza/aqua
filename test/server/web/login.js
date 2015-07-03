var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Manifest = require('../../../manifest');
var Hapi = require('hapi');
var HapiAuth = require('hapi-auth-cookie');
var AuthPlugin = require('../../../server/auth');
var LoginPlugin = require('../../../server/web/login/index');
var AuthenticatedAdmin = require('../fixtures/credentials-admin');
var AuthenticatedAccount = require('../fixtures/credentials-account');


var lab = exports.lab = Lab.script();
var dir = __dirname.toString();
var request, server;
var ModelsPlugin = {
    register: require('hapi-mongo-models'),
    options: Manifest.get('/plugins')['hapi-mongo-models']
};


lab.before(function (done) {

    var plugins = [HapiAuth, ModelsPlugin, AuthPlugin, LoginPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.views({
        engines: { jsx: require('hapi-react-views') },
        path: './server/web',
        relativeTo: Path.join(dir, '..', '..', '..')
    });
    server.register(plugins, function (err) {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.experiment('Login Page View', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/login'
        };

        done();
    });


    lab.test('it renders properly', function (done) {

        server.inject(request, function (response) {

            Code.expect(response.result).to.match(/Sign In/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });


    lab.test('it redirects to /admin when user is authenticated as an admin', function (done) {

        request.credentials = AuthenticatedAdmin;

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });


    lab.test('it redirects to /account when user is authenticated as an account', function (done) {

        request.credentials = AuthenticatedAccount;

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });


    lab.test('it does not redirect when user is authenticated if the path is logout', function (done) {

        request.url += '/logout';
        request.credentials = AuthenticatedAccount;

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});
