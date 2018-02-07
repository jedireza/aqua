'use strict';
const Code = require('code');
const Contact = require('../../../server/api/contact');
const Hapi = require('hapi');
const Lab = require('lab');
const Mailer = require('../../../server/mailer');


const lab = exports.lab = Lab.script();
let server;


lab.before(async () => {

    server = Hapi.Server();

    await server.register(Contact);
    await server.start();
});


lab.after(async () => {

    await server.stop();
});


lab.experiment('POST /api/contact', () => {

    const Mailer_sendEmail = Mailer.sendEmail;
    let request;


    lab.beforeEach(() => {

        request = {
            method: 'POST',
            url: '/api/contact'
        };
    });


    lab.afterEach(() => {

        Mailer.sendEmail = Mailer_sendEmail;
    });


    lab.test('it returns HTTP 200 when all is good', async () => {

        Mailer.sendEmail = () => undefined;

        request.payload = {
            name: 'Foo Barzley',
            email: 'foo@stimpy.show',
            message: 'Hello. How are you?'
        };

        const response = await server.inject(request);

        Code.expect(response.statusCode).to.equal(200);
        Code.expect(response.result.message).to.match(/success/i);
    });
});
