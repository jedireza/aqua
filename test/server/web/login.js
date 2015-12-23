'use strict';
const AuthPlugin = require('../../../server/auth');
const AuthenticatedAccount = require('../fixtures/credentials-account');
const AuthenticatedAdmin = require('../fixtures/credentials-admin');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const LoginPlugin = require('../../../server/web/login/index');
const Manifest = require('../../../manifest');
const Path = require('path');
const Vision = require('vision');


const lab = exports.lab = Lab.script();
const ModelsPlugin = {
    register: require('hapi-mongo-models'),
    options: Manifest.get('/registrations').filter((reg) => {

        return reg.plugin.register === 'hapi-mongo-models';
    })[0].plugin.options
};
let request;
let server;


lab.before((done) => {

    const plugins = [Vision, HapiAuth, ModelsPlugin, AuthPlugin, LoginPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.views({
            engines: { jsx: require('hapi-react-views') },
            path: './server/web',
            relativeTo: Path.join(__dirname, '..', '..', '..')
        });

        server.initialize(done);
    });
});


lab.experiment('Login Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/login'
        };

        done();
    });


    lab.test('it renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/Sign In/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });


    lab.test('it redirects to /admin when user is authenticated as an admin', (done) => {

        request.credentials = AuthenticatedAdmin;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });


    lab.test('it redirects to /account when user is authenticated as an account', (done) => {

        request.credentials = AuthenticatedAccount;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(302);
            done();
        });
    });


    lab.test('it does not redirect when user is authenticated if the path is logout', (done) => {

        request.url += '/logout';
        request.credentials = AuthenticatedAccount;

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});
