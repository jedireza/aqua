'use strict';
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const Session = require('../../../server/models/session');
const Sessions = require('../../../server/api/sessions');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
let server;
let rootCredentials;
let rootSession;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Sessions.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Sessions);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    rootCredentials = await Fixtures.Creds.createRootAdminUser();

    rootSession = rootCredentials.session;
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /api/sessions', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/sessions',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.data).to.be.an.array();
        Code.expect(response.result.pages).to.be.an.object();
        Code.expect(response.result.items).to.be.an.object();
    });
});


lab.experiment('GET /api/sessions/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/sessions/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Session.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const user = await User.create('darcie', 'uplate', 'darcie@late.night');
        const session = await Session.create(`${user._id}`, '127.0.0.1', 'Lab');

        request.url = request.url.replace(/{id}/, session._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.userId).to.equal(`${user._id}`);
    });
});


lab.experiment('DELETE /api/sessions/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/sessions/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Session.findByIdAndDelete` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const user = await User.create('aldon', 'thirsty', 'aldon@late.night');
        const session = await Session.create(`${user._id}`, '127.0.0.1', 'Lab');

        request.url = request.url.replace(/{id}/, session._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.message).to.match(/success/i);
    });
});


lab.experiment('GET /api/sessions/my', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/sessions/my',
            credentials: rootCredentials
        };
    });

    lab.test('it returns HTTP 200 when all is well', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.array();
        Code.expect(response.result.length).to.equal(1);
    });
});


lab.experiment('DELETE /api/sessions/my/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/sessions/my/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 400 when tryint to destroy current session', async () => {

        request.url = request.url.replace(/{id}/, rootSession._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(400);
        Code.expect(response.result.message).to.match(/current session/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const session = await Session.create(rootSession.userId, '127.0.0.2', 'Lab');

        request.url = request.url.replace(/{id}/, session._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.message).to.match(/success/i);
    });
});
