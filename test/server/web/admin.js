'use strict';
const AdminPlugin = require('../../../server/web/admin/index');
const AuthPlugin = require('../../../server/auth');
const AuthenticatedAdmin = require('../fixtures/credentials-admin');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
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


lab.beforeEach((done) => {

    const plugins = [Vision, HapiAuth, ModelsPlugin, AuthPlugin, AdminPlugin];
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


lab.experiment('Admin Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admin',
            credentials: AuthenticatedAdmin
        };

        done();
    });



    lab.test('Admin page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/admin/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
