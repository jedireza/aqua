var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Manifest = require('../../../manifest');
var Hapi = require('hapi');
var HapiAuth = require('hapi-auth-cookie');
var Proxyquire = require('proxyquire');
var AuthPlugin = require('../../../server/auth');
var SignupPlugin = require('../../../server/api/signup');
var MailerPlugin = require('../../../server/mailer');


var lab = exports.lab = Lab.script();
var ModelsPlugin, request, server, stub;


lab.before(function (done) {

    stub = {
        Account: {},
        Session: {},
        User: {}
    };

    var proxy = {};
    proxy[Path.join(process.cwd(), './server/models/account')] = stub.Account;
    proxy[Path.join(process.cwd(), './server/models/session')] = stub.Session;
    proxy[Path.join(process.cwd(), './server/models/user')] = stub.User;

    ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/plugins')['hapi-mongo-models']
    };

    var plugins = [HapiAuth, ModelsPlugin, AuthPlugin, MailerPlugin, SignupPlugin];
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


lab.experiment('Signup Plugin', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'POST',
            url: '/signup',
            payload: {
                name: 'Muddy Mudskipper',
                username: 'muddy',
                password: 'dirtandwater',
                email: 'mrmud@mudmail.mud'
            }
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


    lab.test('it returns an error if any critical setup step fails', function (done) {

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


    lab.test('it finishes successfully (even if sending welcome email fails)', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.create = function (username, password, email, callback) {

            callback(null, { _id: 'BL4M0' });
        };

        stub.Account.create = function (name, callback) {

            var account = {
                _id: 'BL4M0',
                name: {
                    first: 'Muddy',
                    last: 'Mudskipper'
                }
            };

            callback(null, account);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, [{}, {}]);
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, [{}, {}]);
        };

        var realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(new Error('Whoops.'));
        };

        stub.Session.create = function (username, callback) {

            callback(null, {});
        };

        var realWarn = console.warn;
        console.warn = function () {

            console.warn = realWarn;
            done();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            server.plugins.mailer.sendEmail = realSendEmail;
        });
    });


    lab.test('it finishes successfully', function (done) {

        stub.User.findOne = function (conditions, callback) {

            callback();
        };

        stub.User.create = function (username, password, email, callback) {

            callback(null, { _id: 'BL4M0' });
        };

        stub.Account.create = function (name, callback) {

            var account = {
                _id: 'BL4M0',
                name: {
                    first: 'Muddy',
                    last: 'Mudskipper'
                }
            };

            callback(null, account);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, [{}, {}]);
        };

        stub.Account.findByIdAndUpdate = function (id, update, callback) {

            callback(null, [{}, {}]);
        };

        var realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(null, {});
        };

        stub.Session.create = function (username, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            server.plugins.mailer.sendEmail = realSendEmail;

            done();
        });
    });
});
