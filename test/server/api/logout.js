'use strict';
const AuthPlugin = require('../../../server/auth');
const AuthenticatedUser = require('../fixtures/credentials-admin');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Hoek = require('hoek');
const Lab = require('lab');
const LogoutPlugin = require('../../../server/api/logout');
const MakeMockModel = require('../fixtures/make-mock-model');
const Manifest = require('../../../manifest');
const Path = require('path');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
let request;
let server;
let stub;


lab.before((done) => {

    stub = {
        Session: MakeMockModel()
    };

    const proxy = {};
    proxy[Path.join(process.cwd(), './server/models/session')] = stub.Session;

    const ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/registrations').filter((reg) => {

            if (reg.plugin &&
                reg.plugin.register &&
                reg.plugin.register === 'hapi-mongo-models') {

                return true;
            }

            return false;
        })[0].plugin.options
    };

    const plugins = [HapiAuth, ModelsPlugin, AuthPlugin, LogoutPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.initialize(done);
    });
});


lab.after((done) => {

    server.plugins['hapi-mongo-models'].MongoModels.disconnect();
    done();
});


lab.experiment('Logout Plugin (Delete Session)', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/logout',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when delete fails', (done) => {

        stub.Session.findByIdAndDelete = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('delete failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when delete misses (no credentials)', (done) => {

        stub.Session.findByIdAndDelete = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, 0);
        };

        delete request.credentials;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a not found when delete misses (missing user from credentials)', (done) => {

        stub.Session.deleteOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, 0);
        };

        const CorruptedAuthenticatedUser = Hoek.clone(AuthenticatedUser);
        CorruptedAuthenticatedUser.user = undefined;
        request.credentials = CorruptedAuthenticatedUser;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it deletes the authenticated user session successfully', (done) => {

        stub.Session.findByIdAndDelete = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, 1);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.success).to.be.true();

            done();
        });
    });
});
