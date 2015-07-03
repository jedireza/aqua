var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Hapi = require('hapi');
var ContactPlugin = require('../../../server/web/contact/index');


var lab = exports.lab = Lab.script();
var request, server;


lab.beforeEach(function (done) {

    var plugins = [ContactPlugin];
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


lab.experiment('Contact Page View', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/contact'
        };

        done();
    });



    lab.test('contact page renders properly', function (done) {

        server.inject(request, function (response) {

            Code.expect(response.result).to.match(/Contact Us/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
