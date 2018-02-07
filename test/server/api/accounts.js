'use strict';
const Account = require('../../../server/models/account');
const Accounts = require('../../../server/api/accounts');
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const Status = require('../../../server/models/status');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
let server;
let rootCredentials;
let adminCredentials;
let accountCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Accounts.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Accounts);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    [rootCredentials, adminCredentials, accountCredentials] = await Promise.all([
        Fixtures.Creds.createRootAdminUser(),
        Fixtures.Creds.createAdminUser('Ren Hoek', 'ren', 'baddog', 'ren@stimpy.show'),
        Fixtures.Creds.createAccountUser('Stimpson Cat', 'stimpy', 'goodcat', 'stimpy@ren.show')
    ]);
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /api/accounts', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/accounts',
            credentials: adminCredentials
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


lab.experiment('POST /api/accounts', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/accounts',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        request.payload = {
            name: 'Steve'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.and.object();
        Code.expect(response.result.name).to.be.and.object();
        Code.expect(response.result.name.first).to.equal('Steve');
    });
});


lab.experiment('GET /api/accounts/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/accounts/{id}',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Account.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const account = await Account.create('Steve');

        request.url = request.url.replace(/{id}/, account._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Steve');
    });
});


lab.experiment('PUT /api/accounts/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/accounts/{id}',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Account.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload =  {
            name: {
                first: 'Stephen',
                middle: '',
                last: 'Colbert'
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const account = await Account.create('Steve');

        request.url = request.url.replace(/{id}/, account._id);
        request.payload =  {
            name: {
                first: 'Stephen',
                middle: '',
                last: 'Colbert'
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Stephen');
        Code.expect(response.result.name.middle).to.equal('');
        Code.expect(response.result.name.last).to.equal('Colbert');
    });
});


lab.experiment('DELETE /api/accounts/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/accounts/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Account.findByIdAndDelete` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const account = await Account.create('Steve');

        request.url = request.url.replace(/{id}/, account._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.message).to.match(/success/i);
    });
});


lab.experiment('PUT /api/accounts/{id}/user', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/accounts/{id}/user',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Account.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            username: 'colbert'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 404 when `User.findByUsername` misses', async () => {

        const account = await Account.create('Stephen Colbert');

        request.url = request.url.replace(/{id}/, account._id);
        request.payload = {
            username: 'colbert'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 409 when the user is linked to another account', async () => {

        const { roles: { account: accountA } } = await Fixtures.Creds.createAccountUser(
            'Trevor Noah', 'trevor', 'haha', 'trevor@daily.show'
        );

        const { user: userB } = await Fixtures.Creds.createAccountUser(
            'Jon Stewart', 'jon', 'stew', 'jon@daily.show'
        );

        request.url = request.url.replace(/{id}/, accountA._id);
        request.payload = {
            username: userB.username
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/linked to an account/i);
    });


    lab.test('it returns HTTP 409 when the account is currently linked to user', async () => {

        const { roles: { account: account } } = await Fixtures.Creds.createAccountUser(
            'Mr Horse', 'mrh', 'negh', 'mrh@stimpy.show'
        );

        request.url = request.url.replace(/{id}/, account._id);
        request.payload = {
            username: 'ren'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/linked to a user/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const account = await Account.create('Rand Rando');
        const user = await User.create('random', 'passw0rd', 'random@user.gov');

        request.url = request.url.replace(/{id}/, account._id);
        request.payload = {
            username: user.username
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Rand');
        Code.expect(response.result.name.last).to.equal('Rando');
        Code.expect(response.result.user).to.be.an.object();
        Code.expect(response.result.user.name).to.equal('random');
    });
});


lab.experiment('DELETE /api/accounts/{id}/user', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/accounts/{id}/user',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Account.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when `account.user` is not present', async () => {

        const account = await Account.create('Randomoni Randomie');

        request.url = request.url.replace(/{id}/, account._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Randomoni');
        Code.expect(response.result.name.last).to.equal('Randomie');
    });


    lab.test('it returns HTTP 404 when `User.findById` misses', async () => {

        const { roles: { account: account }, user } = await Fixtures.Creds.createAccountUser(
            'Lil Horse', 'lilh', 'negh', 'lilh@stimpy.show'
        );

        await User.findByIdAndDelete(user._id);

        request.url = request.url.replace(/{id}/, account._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is good', async () => {

        const { roles: { account: account }, user } = await Fixtures.Creds.createAccountUser(
            'Jr Horse', 'jrh', 'negh', 'jrh@stimpy.show'
        );

        request.url = request.url.replace(/{id}/, account._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Jr');
        Code.expect(response.result.name.last).to.equal('Horse');
        Code.expect(response.result.user).to.not.exist();

        const user_ = await User.findByIdAndDelete(user._id);

        Code.expect(user_).to.be.an.object();
        Code.expect(user_.roles).to.be.an.object();
        Code.expect(user_.roles.account).to.not.exist();
    });
});


lab.experiment('POST /api/accounts/{id}/notes', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/accounts/{id}/notes',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Account.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            data: 'Super duper note!'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const account = await Account.create('Here And Gone');

        request.url = request.url.replace(/{id}/, account._id);
        request.payload = {
            data: 'Super duper note!'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Here');
        Code.expect(response.result.name.middle).to.equal('And');
        Code.expect(response.result.name.last).to.equal('Gone');
        Code.expect(response.result.notes.length).to.be.greaterThan(0);
    });
});


lab.experiment('POST /api/accounts/{id}/status', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/accounts/{id}/status',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Status.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            status: 'poison-pill'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 404 when `Account.findByIdAndUpdate` misses', async () => {

        const status = await Status.create('Account', 'Sad');

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            status: status._id
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const status = await Status.create('Account', 'Happy');
        const account = await Account.create('Here And Now');

        request.url = request.url.replace(/{id}/, account._id);
        request.payload = {
            status: status._id
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Here');
        Code.expect(response.result.name.middle).to.equal('And');
        Code.expect(response.result.name.last).to.equal('Now');
        Code.expect(response.result.status).to.be.an.object();
        Code.expect(response.result.status.current).to.be.an.object();
        Code.expect(response.result.status.current.id).to.equal(`${status._id}`);
        Code.expect(response.result.status.current.name).to.equal('Happy');
        Code.expect(response.result.status.log).to.be.an.array();
        Code.expect(response.result.status.log.length).to.be.greaterThan(0);
    });
});


lab.experiment('GET /api/accounts/my', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/accounts/my',
            credentials: accountCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Stimpson');
    });
});


lab.experiment('PUT /api/accounts/my', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/accounts/my',
            credentials: accountCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        request.payload = {
            name: {
                first: 'Stimpson',
                middle: 'J',
                last: 'Cat'
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Stimpson');
        Code.expect(response.result.name.middle).to.equal('J');
        Code.expect(response.result.name.last).to.equal('Cat');
    });
});
