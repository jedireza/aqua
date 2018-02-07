'use strict';
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const Status = require('../../../server/models/status');
const Statuses = require('../../../server/api/statuses');


const lab = exports.lab = Lab.script();
let server;
let rootCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Statuses.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Statuses);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    rootCredentials = await Fixtures.Creds.createRootAdminUser();
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /api/statuses', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/statuses',
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


lab.experiment('POST /api/statuses', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/statuses',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        request.payload = {
            name: 'Happy',
            pivot: 'Account'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.and.object();
        Code.expect(response.result.name).to.be.equal('Happy');
        Code.expect(response.result.pivot).to.be.equal('Account');
    });
});


lab.experiment('GET /api/statuses/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/statuses/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Status.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, 'missing-status');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const status = await Status.create('Account', 'Sad');

        request.url = request.url.replace(/{id}/, status._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.equal('Sad');
        Code.expect(response.result.pivot).to.equal('Account');
    });
});


lab.experiment('PUT /api/statuses/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/statuses/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Status.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, 'account-emojiface');
        request.payload =  {
            name: 'Wrecking Crew'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const status = await Status.create('Admin', 'Cold');

        request.url = request.url.replace(/{id}/, status._id);
        request.payload =  {
            name: 'Hot'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.equal('Hot');
        Code.expect(response.result.pivot).to.equal('Admin');
    });
});


lab.experiment('DELETE /api/statuses/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/statuses/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Status.findByIdAndDelete` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const status = await Status.create('Account', 'Above');

        request.url = request.url.replace(/{id}/, status._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.message).to.match(/success/i);
    });
});
