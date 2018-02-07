'use strict';
const Auth = require('../../server/auth');
const Code = require('code');
const Fixtures = require('./fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../manifest');
const Session = require('../../server/models/session');
const User = require('../../server/models/user');


const lab = exports.lab = Lab.script();
let server;


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

    server.route({
        method: 'GET',
        path: '/',
        options: {
            auth: false,
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        },
        handler: async function (request, h) {

            try {
                await request.server.auth.test('session', request);

                return { isValid: true };
            }
            catch (err) {
                // console.log(err);

                return { isValid: false };
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        options: {
            auth: false
        },
        handler: async function (request, h) {

            const [adminCreds] = await Promise.all([
                Fixtures.Creds.createAdminUser('Ren Hoek', 'ren', 'baddog', 'ren@stimpy.show')
            ]);

            if (request.query && request.query.badSession) {
                adminCreds.session.key = 'blamo';
            }

            if (request.query && request.query.badUser) {
                const sessionUpdate = {
                    $set: {
                        userId: '555555555555555555555555'
                    }
                };

                await Session.findByIdAndUpdate(adminCreds.session._id, sessionUpdate);
            }

            if (request.query && request.query.notActive) {
                const userUpdate = {
                    $set: {
                        isActive: false
                    }
                };

                await User.findByIdAndUpdate(adminCreds.user._id, userUpdate);
            }

            const creds = {
                user: {
                    _id: adminCreds.user._id,
                    username: adminCreds.user.username,
                    email: adminCreds.user.email,
                    roles: adminCreds.user.roles
                },
                session: adminCreds.session
            };

            request.cookieAuth.set(creds);

            return creds;
        }
    });
});


lab.after(async () => {

    await server.stop();
});


lab.experiment('Session Auth Strategy', () => {

    lab.afterEach(async () => {

        await Fixtures.Db.removeAllData();
    });


    lab.test('it returns as invalid without authentication provided', async () => {

        const request = {
            method: 'GET',
            url: '/'
        };
        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.isValid).to.equal(false);
    });


    lab.test('it returns as invalid when the session query misses', async () => {

        const loginRequest = {
            method: 'POST',
            url: '/login?badSession=1'
        };
        const loginResponse = await server.inject(loginRequest);
        const cookie = loginResponse.headers['set-cookie'][0].replace(/;.*$/, '');

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.isValid).to.equal(false);
    });


    lab.test('it returns as invalid when the user query misses', async () => {

        const loginRequest = {
            method: 'POST',
            url: '/login?badUser=1'
        };
        const loginResponse = await server.inject(loginRequest);
        const cookie = loginResponse.headers['set-cookie'][0].replace(/;.*$/, '');
        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie
            }
        };
        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.isValid).to.equal(false);
    });


    lab.test('it returns as invalid when the user is not active', async () => {

        const loginRequest = {
            method: 'POST',
            url: '/login?notActive=1'
        };
        const loginResponse = await server.inject(loginRequest);
        const cookie = loginResponse.headers['set-cookie'][0].replace(/;.*$/, '');
        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.isValid).to.equal(false);
    });


    lab.test('it returns as valid when all is well', async () => {

        const loginRequest = {
            method: 'POST',
            url: '/login'
        };
        const loginResponse = await server.inject(loginRequest);
        const cookie = loginResponse.headers['set-cookie'][0].replace(/;.*$/, '');
        const request = {
            method: 'GET',
            url: '/',
            headers: {
                cookie
            }
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.isValid).to.equal(true);
    });
});
