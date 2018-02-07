'use strict';
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const User = require('../../../server/models/user');
const Users = require('../../../server/api/users');


const lab = exports.lab = Lab.script();
let server;
let rootCredentials;
let accountCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Users.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Users);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    [rootCredentials, accountCredentials] = await Promise.all([
        Fixtures.Creds.createRootAdminUser(),
        Fixtures.Creds.createAccountUser('Stimpson Cat', 'stimpy', 'goodcat', 'stimpy@ren.show'),
        Fixtures.Creds.createAdminUser('Ren Hoek', 'ren', 'baddog', 'ren@stimpy.show')
    ]);
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /api/users', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/users',
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


lab.experiment('POST /api/users', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/users',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 409 when the username is already in use', async () => {

        request.payload = {
            email: 'steve@stimpy.show',
            password: 'lovely',
            username: 'ren'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/username already in use/i);
    });


    lab.test('it returns HTTP 409 when the email is already in use', async () => {

        request.payload = {
            email: 'ren@stimpy.show',
            password: 'lovely',
            username: 'steveplease'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/email already in use/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        request.payload = {
            email: 'steve@stimpy.show',
            password: 'lovely',
            username: 'steveplease'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.and.object();
        Code.expect(response.result.username).to.equal('steveplease');
    });
});


lab.experiment('GET /api/users/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/users/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `User.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const user = await User.create('mrcolbert', 'colbert123', 'mr@colbert.baz');

        request.url = request.url.replace(/{id}/, user._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.username).to.equal('mrcolbert');
    });
});


lab.experiment('PUT /api/users/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/users/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 409 when the username is already in use', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            isActive: true,
            email: 'ren@stimpy.show',
            username: 'ren'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/username already in use/i);
    });


    lab.test('it returns HTTP 409 when the email is already in use', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            isActive: true,
            email: 'ren@stimpy.show',
            username: 'pleasesteve'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/email already in use/i);
    });


    lab.test('it returns HTTP 404 when `User.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            isActive: true,
            email: 'pleasesteve@stimpy.show',
            username: 'pleasesteve'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const user = await User.create('finally', 'gue55', 'finally@made.it');

        request.url = request.url.replace(/{id}/, user._id);
        request.payload = {
            isActive: true,
            email: 'finally@made.io',
            username: 'yllanif'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.username).to.equal('yllanif');
        Code.expect(response.result.email).to.equal('finally@made.io');
    });
});


lab.experiment('DELETE /api/users/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/users/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `User.findByIdAndDelete` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const user = await User.create('deleteme', '0000', 'delete@me.please');

        request.url = request.url.replace(/{id}/, user._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.message).to.match(/success/i);
    });
});


lab.experiment('PUT /api/users/{id}/password', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/users/{id}/password',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `User.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            password: '53cur3p455'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const user = await User.create('finally', 'gue55', 'finally@made.it');

        request.url = request.url.replace(/{id}/, user._id);
        request.payload = {
            password: '53cur3p455'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.username).to.equal('finally');
    });
});


lab.experiment('GET /api/users/my', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/users/my',
            credentials: accountCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.username).to.equal('stimpy');
    });
});


lab.experiment('PUT /api/users/my', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/users/my',
            credentials: accountCredentials
        };
    });


    lab.test('it returns HTTP 409 when the username is already in use', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            email: 'ren@stimpy.show',
            username: 'ren'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/username already in use/i);
    });


    lab.test('it returns HTTP 409 when the email is already in use', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            email: 'ren@stimpy.show',
            username: 'pleasesteve'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/email already in use/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        request.payload = {
            email: 'stimpy@gmail.gov',
            username: 'stimpson'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.username).to.equal('stimpson');
        Code.expect(response.result.email).to.equal('stimpy@gmail.gov');
    });
});


lab.experiment('PUT /api/users/my/password', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/users/my/password',
            credentials: accountCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        request.payload = {
            password: '53cur3p455'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.username).to.equal('stimpson');
    });
});
