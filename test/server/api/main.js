'use strict';
const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Main = require('../../../server/api/main');


const lab = exports.lab = Lab.script();
let server;


lab.before(async () => {

    server = Hapi.Server();

    await server.register(Main);
    await server.start();
});


lab.after(async () => {

    await server.stop();
});


lab.experiment('GET /api', () => {

    let request;


    lab.beforeEach(() => {

        request = {
            method: 'GET',
            url: '/api'
        };
    });


    lab.test('it returns HTTP 200 when all is good', async () => {

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.message).to.match(/welcome/i);
    });
});
