'use strict';
const AccountPlugin = require('../../../server/web/account/index');
const AuthPlugin = require('../../../server/auth');
const AuthenticatedAccount = require('../fixtures/credentials-account');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
//const Manifest = require('../../../manifest');
const Path = require('path');
const Vision = require('vision');


const lab = exports.lab = Lab.script();

const HapiModelsPlugin = {
    register: require('hapi-sequelize'),
    options: {
        sequelize : require('../../misc/db'),
        //todo not like dbsetup.js cause models are already registered in test/misc/db.js
        sync: true
    }
};
/*
const ModelsPlugin = {
    register: require('hapi-mongo-models'),
    options: Manifest.get('/registrations').filter((reg) => {
        console.log('regs is ', reg);

        return reg.plugin.register === 'hapi-mongo-models';
    })[0].plugin.options
};
*/
let request;
let server;


lab.before((done) => {

    //const plugins = [Vision, HapiAuth, ModelsPlugin, AuthPlugin, AccountPlugin];
    const plugins = [Vision, HapiAuth, HapiModelsPlugin, AuthPlugin, AccountPlugin];
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


lab.experiment('Account Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/account',
            credentials: AuthenticatedAccount
        };

        done();
    });


    lab.test('Account page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/account/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
