'use strict';
const Auth = require('../../server/auth');
const Code = require('code');
const Fixtures = require('./fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../manifest');
const Preware = require('../../server/preware');


const lab = exports.lab = Lab.script();
let server;
let adminCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Auth.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    const auth = { strategy: 'session', scope: 'admin' };
    const handler = (request, h) => ({ message: 'ok' });

    server.route({
        method: 'GET',
        path: '/limited/to/root/group',
        options: {
            auth,
            pre: [
                Preware.requireAdminGroup('root')
            ]
        },
        handler
    });

    server.route({
        method: 'GET',
        path: '/limited/to/multiple/groups',
        options: {
            auth,
            pre: [
                Preware.requireAdminGroup(['sales', 'support'])
            ]
        },
        handler
    });

    server.route({
        method: 'GET',
        path: '/just/not/the/root/user',
        options: {
            auth,
            pre: [
                Preware.requireNotRootUser
            ]
        },
        handler
    });

    adminCredentials = await Fixtures.Creds.createAdminUser(
        'Ren Hoek', 'ren', 'baddog', 'ren@stimpy.show', ['Sales']
    );
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('Preware', () => {

    lab.test('it prevents access when group membership misses', async () => {

        const request = {
            method: 'GET',
            url: '/limited/to/root/group',
            credentials: adminCredentials
        };
        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(403);
    });


    lab.test('it grants access when group membership hits', async () => {

        const request = {
            method: 'GET',
            url: '/limited/to/multiple/groups',
            credentials: adminCredentials
        };
        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
    });


    lab.test('it prevents access to the root user', async () => {

        const rootCredentails = await Fixtures.Creds.createRootAdminUser();
        const request = {
            method: 'GET',
            url: '/just/not/the/root/user',
            credentials: rootCredentails
        };
        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(403);
    });


    lab.test('it grants access to non-root users', async () => {

        const request = {
            method: 'GET',
            url: '/just/not/the/root/user',
            credentials: adminCredentials
        };
        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
    });
});
