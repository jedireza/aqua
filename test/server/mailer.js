'use strict';
const Code = require('code');
const Config = require('../../config');
const Hapi = require('hapi');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    fs: {},
    nodemailer: {
        createTransport: function (smtp) {

            return {
                use: function () {

                    return;
                },
                sendMail: function (options, callback) {

                    return callback(null, {});
                }
            };
        }
    }
};
const MailerPlugin = Proxyquire('../../server/mailer', {
    'fs': stub.fs,
    'nodemailer': stub.nodemailer
});


lab.experiment('Mailer Plugin', () => {

    let server;


    lab.before((done) => {

        server = new Hapi.Server();
        server.connection({ port: Config.get('/port/web') });
        server.register(MailerPlugin, (err) => {

            if (err) {
                return done(err);
            }

            done();
        });
    });


    lab.test('it successfuly registers itself', (done) => {

        Code.expect(server.plugins.mailer).to.be.an.object();
        Code.expect(server.plugins.mailer.sendEmail).to.be.a.function();

        done();
    });


    lab.test('it returns error when read file fails', (done) => {

        const realReadFile = stub.fs.readFile;
        stub.fs.readFile = function (path, options, callback) {

            return callback(Error('read file failed'));
        };

        server.plugins.mailer.sendEmail({}, 'path', {}, (err, info) => {

            stub.fs.readFile = realReadFile;
            Code.expect(err).to.be.an.object();

            done();
        });
    });


    lab.test('it sends an email', (done) => {

        const realReadFile = stub.fs.readFile;
        stub.fs.readFile = function (path, options, callback) {

            return callback(null, '');
        };

        server.plugins.mailer.sendEmail({}, 'path', {}, (err, info) => {

            Code.expect(err).to.not.exist();
            Code.expect(info).to.be.an.object();

            stub.fs.readFile = realReadFile;

            done();
        });
    });


    lab.test('it returns early with the template is cached', (done) => {

        const realReadFile = stub.fs.readFile;
        stub.fs.readFile = function (path, options, callback) {

            return callback(null, '');
        };

        server.plugins.mailer.sendEmail({}, 'path', {}, (err, info) => {

            Code.expect(err).to.not.exist();
            Code.expect(info).to.be.an.object();

            stub.fs.readFile = realReadFile;

            done();
        });
    });
});
