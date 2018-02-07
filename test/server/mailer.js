'use strict';
const Code = require('code');
const Config = require('../../config');
const Lab = require('lab');
const Mailer = require('../../server/mailer');


const lab = exports.lab = Lab.script();


lab.experiment('Mailer', () => {

    const Mailer_transport = Mailer.transport;


    lab.afterEach(() => {

        Mailer.transport = Mailer_transport;
    });


    lab.test('it populates the template cache on first render', async () => {

        const context = { username: 'ren', email: 'ren@stimpy.show' };
        const content = await Mailer.renderTemplate('welcome', context);

        Code.expect(content).to.match(/ren@stimpy.show/i);
    });


    lab.test('it uses the template cache on subsequent renders', async () => {

        const context = { username: 'stimpy', email: 'stimpy@ren.show' };
        const content = await Mailer.renderTemplate('welcome', context);

        Code.expect(content).to.match(/stimpy@ren.show/i);
    });


    lab.test('it sends the email through the the transport', async () => {

        Mailer.transport = {
            sendMail: function (options) {

                Code.expect(options).to.be.an.object();
                Code.expect(options.from).to.equal(Config.get('/system/fromAddress'));
                Code.expect(options.cc).to.be.an.object();
                Code.expect(options.cc.email).to.equal('stimpy@ren.show');

                return { wasSent: true };
            }
        };

        const context = { username: 'stimpy', email: 'stimpy@ren.show' };
        const content = await Mailer.renderTemplate('welcome', context);
        const options = {
            cc: {
                name: 'Stimpson J Cat',
                email: 'stimpy@ren.show'
            }
        };

        const info = await Mailer.sendEmail(options, 'welcome', context);

        Code.expect(info).to.be.an.object();
        Code.expect(info.wasSent).to.equal(true);
        Code.expect(content).to.match(/stimpy@ren.show/i);
    });
});
