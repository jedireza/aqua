'use strict';
const Admin = require('../../../server/web/admin/index');
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');


const lab = exports.lab = Lab.script();
let server;
let adminCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Admin.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Admin);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    [adminCredentials] = await Promise.all([
        Fixtures.Creds.createAdminUser('Ren Hoek', 'ren', 'baddog', 'ren@stimpy.show')
    ]);
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /admin', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/admin',
            credentials: adminCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is good', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.match(/admin/i);
        Code.expect(response.result).to.match(/app-mount/i);
    });
});
