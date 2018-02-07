'use strict';
const Account = require('../../../server/web/account/index');
const Auth = require('../../../server/auth');
const Code = require('code');
const Fixtures = require('../fixtures');
const Hapi = require('hapi');
const Lab = require('lab');
const Manifest = require('../../../manifest');


const lab = exports.lab = Lab.script();
let server;
let accountCredentials;


lab.before(async () => {

    server = Hapi.Server();

    const plugins = Manifest.get('/register/plugins')
        .filter((entry) => Account.dependencies.includes(entry.plugin))
        .map((entry) => {

            entry.plugin = require(entry.plugin);

            return entry;
        });

    plugins.push(Auth);
    plugins.push(Account);

    await server.register(plugins);
    await server.start();
    await Fixtures.Db.removeAllData();

    [accountCredentials] = await Promise.all([
        Fixtures.Creds.createAccountUser('Stimpson Cat', 'stimpy', 'goodcat', 'stimpy@ren.show')
    ]);
});


lab.after(async () => {

    await Fixtures.Db.removeAllData();
    await server.stop();
});


lab.experiment('GET /account', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/account',
            credentials: accountCredentials
        };
    });


    lab.test('it returns HTTP 200 when all is good', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result).to.match(/account/i);
        Code.expect(response.result).to.match(/app-mount/i);
    });
});
