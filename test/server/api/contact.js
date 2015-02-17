var Lab = require('lab');
var Code = require('code');
var Config = require('../../../config');
var Hapi = require('hapi');
var MailerPlugin = require('../../../server/mailer');
var ContactPlugin = require('../../../server/api/contact');


var lab = exports.lab = Lab.script();
var request, server;


lab.beforeEach(function (done) {

    var plugins = [ MailerPlugin, ContactPlugin ];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, function (err) {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.experiment('Contact Plugin', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'POST',
            url: '/contact',
            payload: {
                name: 'Toast Man',
                email: 'mr@toast.show',
                message: 'I love you man.'
            }
        };

        done();
    });


    lab.test('it returns an error when send email fails', function (done) {

        var realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(Error('send email failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            server.plugins.mailer.sendEmail = realSendEmail;

            done();
        });
    });


    lab.test('it returns success after sending an email', function (done) {

        var realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);

            server.plugins.mailer.sendEmail = realSendEmail;

            done();
        });
    });
});
