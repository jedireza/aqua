var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Hapi = require('hapi');
var SignupPlugin = require('../../../server/web/signup/index');


var lab = exports.lab = Lab.script();
var request, server;


lab.beforeEach(function (done) {

    var plugins = [SignupPlugin];
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


lab.experiment('Sign Up Page View', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/signup'
        };

        done();
    });



    lab.test('Sign Up page renders properly', function (done) {

        server.inject(request, function (response) {

            Code.expect(response.result).to.match(/Sign up/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
