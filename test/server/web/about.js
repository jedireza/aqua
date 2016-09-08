'use strict';
const AboutPlugin = require('../../../server/web/about/index');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const Lab = require('lab');
const Path = require('path');
const Vision = require('vision');


const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [Vision, AboutPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.views({
            engines: { jsx: require('hapi-react-views') },
            path: './server/web',
            relativeTo: Path.join(__dirname, '..', '..', '..')
        });

        done();
    });
});


lab.experiment('About Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/about'
        };

        done();
    });


    lab.test('about page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/About us/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
