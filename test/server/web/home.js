'use strict';
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HomePlugin = require('../../../server/web/home/index');
const Lab = require('lab');
const Path = require('path');
const Vision = require('vision');


const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [Vision, HomePlugin];
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


lab.experiment('Home Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/'
        };

        done();
    });



    lab.test('home page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/Success/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
