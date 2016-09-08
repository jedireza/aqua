'use strict';
const Code = require('code');
const Config = require('../../../config');
const ContactPlugin = require('../../../server/api/contact');
const Hapi = require('hapi');
const Lab = require('lab');
const MailerPlugin = require('../../../server/mailer');


const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [MailerPlugin, ContactPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.initialize(done);
    });
});


lab.experiment('Contact Plugin', () => {

    lab.beforeEach((done) => {

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


    lab.test('it returns an error when send email fails', (done) => {

        const realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(Error('send email failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);

            server.plugins.mailer.sendEmail = realSendEmail;

            done();
        });
    });


    lab.test('it returns success after sending an email', (done) => {

        const realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);

            server.plugins.mailer.sendEmail = realSendEmail;

            done();
        });
    });
});
