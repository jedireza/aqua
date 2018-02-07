'use strict';
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Logout = require('../../../server/api/logout');
const Manifest = require('../../../manifest');
const Session = require('../../../server/models/session');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
let server;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Logout.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Logout);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('DELETE /api/logout', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'DELETE',
            url: '/api/logout'
        };
    });


    lab.test('it returns HTTP 200 when credentials are missing', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.message).to.match(/success/i);
    });


    lab.test('it returns HTTP 200 when credentials are present', async () => {

        const user = await User.create('ren', 'baddog', 'ren@stimpy.show');
        const session = await Session.create('ren', 'baddog', 'ren@stimpy.show');

        request.credentials = {
            roles: [],
            session,
            user
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.message).to.match(/success/i);
    });
});
