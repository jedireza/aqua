'use strict';
const Admin = require('../../../server/models/admin');
const Admins = require('../../../server/api/admins');
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
let server;
let rootCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Admins.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Admins);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    [rootCredentials] = await Promise.all([
        Fixtures.Creds.createRootAdminUser(),
        Fixtures.Creds.createAdminUser('Ren Hoek', 'ren', 'baddog', 'ren@stimpy.show')
    ]);
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /api/admins', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/admins',
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


lab.experiment('POST /api/admins', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/admins',
            credentials: rootCredentials
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


lab.experiment('GET /api/admins/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api/admins/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Admin.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const admin = await Admin.create('Steve');

        request.url = request.url.replace(/{id}/, admin._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Steve');
    });
});


lab.experiment('PUT /api/admins/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/admins/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Admin.findByIdAndUpdate` misses', async () => {

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

        const admin = await Admin.create('Steve');

        request.url = request.url.replace(/{id}/, admin._id);
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


lab.experiment('DELETE /api/admins/{id}', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/admins/{id}',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Admin.findByIdAndDelete` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const admin = await Admin.create('Steve');

        request.url = request.url.replace(/{id}/, admin._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.message).to.match(/success/i);
    });
});


lab.experiment('PUT /api/admins/{id}/groups', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/admins/{id}/groups',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Admin.findByIdAndUpdate` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload =  {
            groups: {
                sales: 'Sales',
                support: 'Support'
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const admin = await Admin.create('Group Membership');

        request.url = request.url.replace(/{id}/, admin._id);
        request.payload =  {
            groups: {
                sales: 'Sales',
                support: 'Support'
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Group');
        Code.expect(response.result.name.last).to.equal('Membership');
        Code.expect(response.result.groups).to.be.an.object();
        Code.expect(response.result.groups.sales).to.equal('Sales');
        Code.expect(response.result.groups.support).to.equal('Support');
    });
});


lab.experiment('PUT /api/admins/{id}/permissions', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/admins/{id}/permissions',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Admin.findByIdAndUpdate` misses', async () => {

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

        const admin = await Admin.create('Granular Permisssions');

        request.url = request.url.replace(/{id}/, admin._id);
        request.payload =  {
            permissions: {
                CAN_CREATE_ACCOUNTS: true,
                CAN_DELETE_ACCOUNTS: false
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Granular');
        Code.expect(response.result.name.last).to.equal('Permisssions');
        Code.expect(response.result.permissions).to.be.an.object();
        Code.expect(response.result.permissions.CAN_CREATE_ACCOUNTS).to.be.true();
        Code.expect(response.result.permissions.CAN_DELETE_ACCOUNTS).to.be.false();
    });
});


lab.experiment('PUT /api/admins/{id}/user', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'PUT',
            url: '/api/admins/{id}/user',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Admin.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');
        request.payload = {
            username: 'colbert'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 404 when `User.findByUsername` misses', async () => {

        const admin = await Admin.create('Stephen Colbert');

        request.url = request.url.replace(/{id}/, admin._id);
        request.payload = {
            username: 'colbert'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 409 when the user is linked to another admin', async () => {

        const { roles: { admin: adminA } } = await Fixtures.Creds.createAdminUser(
            'Trevor Noah', 'trevor', 'haha', 'trevor@daily.show'
        );

        const { user: userB } = await Fixtures.Creds.createAdminUser(
            'Jon Stewart', 'jon', 'stew', 'jon@daily.show'
        );

        request.url = request.url.replace(/{id}/, adminA._id);
        request.payload = {
            username: userB.username
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/linked to an admin/i);
    });


    lab.test('it returns HTTP 409 when the admin is currently linked to user', async () => {

        const user = await User.create('hay', 'st4ck', 'hay@stimpy.show');
        const { roles: { admin: admin } } = await Fixtures.Creds.createAdminUser(
            'Mr Horse', 'mrh', 'negh', 'mrh@stimpy.show'
        );

        request.url = request.url.replace(/{id}/, admin._id);
        request.payload = {
            username: user.username
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(409);
        Code.expect(response.result.message).to.match(/linked to a user/i);
    });


    lab.test('it returns HTTP 200 when all is well', async () => {

        const admin = await Admin.create('Rand Rando');
        const user = await User.create('random', 'passw0rd', 'random@user.gov');

        request.url = request.url.replace(/{id}/, admin._id);
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


lab.experiment('DELETE /api/admins/{id}/user', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/admins/{id}/user',
            credentials: rootCredentials
        };
    });


    lab.test('it returns HTTP 404 when `Admin.findById` misses', async () => {

        request.url = request.url.replace(/{id}/, '555555555555555555555555');

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when `admin.user` is not present', async () => {

        const admin = await Admin.create('Randomoni Randomie');

        request.url = request.url.replace(/{id}/, admin._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.be.an.object();
        Code.expect(response.result.name).to.be.an.object();
        Code.expect(response.result.name.first).to.equal('Randomoni');
        Code.expect(response.result.name.last).to.equal('Randomie');
    });


    lab.test('it returns HTTP 404 when `User.findById` misses', async () => {

        const { roles: { admin: admin }, user } = await Fixtures.Creds.createAdminUser(
            'Lil Horse', 'lilh', 'negh', 'lilh@stimpy.show'
        );

        await User.findByIdAndDelete(user._id);

        request.url = request.url.replace(/{id}/, admin._id);

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(404);
        Code.expect(response.result.message).to.match(/not found/i);
    });


    lab.test('it returns HTTP 200 when all is good', async () => {

        const { roles: { admin: admin }, user } = await Fixtures.Creds.createAdminUser(
            'Jr Horse', 'jrh', 'negh', 'jrh@stimpy.show'
        );

        request.url = request.url.replace(/{id}/, admin._id);

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
        Code.expect(user_.roles.admin).to.not.exist();
    });
});
