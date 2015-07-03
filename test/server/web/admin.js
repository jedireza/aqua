var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Manifest = require('../../../manifest');
var Hapi = require('hapi');
var HapiAuth = require('hapi-auth-cookie');
var AuthPlugin = require('../../../server/auth');
var AdminPlugin = require('../../../server/web/admin/index');
var AuthenticatedAdmin = require('../fixtures/credentials-admin');


var lab = exports.lab = Lab.script();
var request, server;
var ModelsPlugin = {
    register: require('hapi-mongo-models'),
    options: Manifest.get('/plugins')['hapi-mongo-models']
};


lab.beforeEach(function (done) {

    var plugins = [HapiAuth, ModelsPlugin, AuthPlugin, AdminPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.views({
        engines: { jsx: require('hapi-react-views') },
        path: './server/web',
        relativeTo: Path.join(__dirname, '..', '..', '..')
    });
    server.register(plugins, function (err) {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.experiment('Admin Page View', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/admin',
            credentials: AuthenticatedAdmin
        };

        done();
    });



    lab.test('Admin page renders properly', function (done) {

        server.inject(request, function (response) {

            Code.expect(response.result).to.match(/Admin/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
