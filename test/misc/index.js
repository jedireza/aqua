'use strict';
const Code = require('code');
const Composer = require('../../index');
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('App', () => {

    lab.test('it composes a server', (done) => {

        Composer((err, composedServer) => {

            Code.expect(composedServer).to.be.an.object();

            done(err);
        });
    });
});
