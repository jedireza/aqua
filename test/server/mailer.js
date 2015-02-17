var Lab = require('lab');
var Code = require('code');
var Config = require('../../config');
var Hapi = require('hapi');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var stub = {
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
var MailerPlugin = Proxyquire('../../server/mailer', {
    'fs': stub.fs,
    'nodemailer': stub.nodemailer
});


lab.experiment('Mailer Plugin', function () {

    var server;


    lab.before(function (done) {

        server = new Hapi.Server();
        server.connection({ port: Config.get('/port/web') });
        server.register(MailerPlugin, function (err) {

            if (err) {
                return done(err);
            }

            done();
        });
    });


    lab.test('it successfuly registers itself', function (done) {

        Code.expect(server.plugins.mailer).to.be.an.object();
        Code.expect(server.plugins.mailer.sendEmail).to.be.a.function();

        done();
    });


    lab.test('it returns error when read file fails', function (done) {

        var realReadFile = stub.fs.readFile;
        stub.fs.readFile = function (path, options, callback) {

            return callback(Error('read file failed'));
        };

        server.plugins.mailer.sendEmail({}, 'path', {}, function (err, info) {

            stub.fs.readFile = realReadFile;
            Code.expect(err).to.be.an.object();

            done();
        });
    });


    lab.test('it sends an email', function (done) {

        var realReadFile = stub.fs.readFile;
        stub.fs.readFile = function (path, options, callback) {

            return callback(null, '');
        };

        server.plugins.mailer.sendEmail({}, 'path', {}, function (err, info) {

            Code.expect(err).to.not.exist();
            Code.expect(info).to.be.an.object();

            stub.fs.readFile = realReadFile;

            done();
        });
    });


    lab.test('it returns early with the template is cached', function (done) {

        var realReadFile = stub.fs.readFile;
        stub.fs.readFile = function (path, options, callback) {

            return callback(null, '');
        };

        server.plugins.mailer.sendEmail({}, 'path', {}, function (err, info) {

            Code.expect(err).to.not.exist();
            Code.expect(info).to.be.an.object();

            stub.fs.readFile = realReadFile;

            done();
        });
    });
});
