'use strict';
const AdminGroup = require('../../../server/models/admin-group');
const AdminGroups = require('../../../server/api/admin-groups');
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');


const lab = exports.lab = Lab.script();
let server;
let rootCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => AdminGroups.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(AdminGroups);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    rootCredentials = await Fixtures.Creds.createRootAdminUser();
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /api/admin-groups', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/admin-groups',
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


lab.experiment('POST /api/admin-groups', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/admin-groups',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        request.payload = {
            name: 'Sales'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.and.object();
        Code.expect(response.result.name).to.be.equal('Sales');
    });
});


lab.experiment('GET /api/admin-groups/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/admin-groups/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `AdminGroup.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const adminGroup = await AdminGroup.create('Support');

        request.url = request.url.replace(/{id}/, adminGroup._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.equal('Support');
    });
});


lab.experiment('PUT /api/admin-groups/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/admin-groups/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `AdminGroup.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload =  {
            name: 'Wrecking Crew'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const adminGroup = await AdminGroup.create('Shipping');

        request.url = request.url.replace(/{id}/, adminGroup._id);
        request.payload =  {
            name: 'Fulfillment'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.equal('Fulfillment');
    });
});


lab.experiment('DELETE /api/admin-groups/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/admin-groups/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `AdminGroup.findByIdAndDelete` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const adminGroup = await AdminGroup.create('Steve');

        request.url = request.url.replace(/{id}/, adminGroup._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.message).to.match(/success/i);
    });
});


lab.experiment('PUT /api/admin-groups/{id}/permissions', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/admin-groups/{id}/permissions',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `AdminGroup.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload =  {
            permissions: {
                CAN_CREATE_ACCOUNTS: true,
                CAN_DELETE_ACCOUNTS: false
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const adminGroup = await AdminGroup.create('Executive');

        request.url = request.url.replace(/{id}/, adminGroup._id);
        request.payload =  {
            permissions: {
                CAN_CREATE_ACCOUNTS: true,
                CAN_DELETE_ACCOUNTS: false
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.equal('Executive');
        Code.expect(response.result.permissions).to.be.an.object();
        Code.expect(response.result.permissions.CAN_CREATE_ACCOUNTS).to.be.true();
        Code.expect(response.result.permissions.CAN_DELETE_ACCOUNTS).to.be.false();
    });
});
