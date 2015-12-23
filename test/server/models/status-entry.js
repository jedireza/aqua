'use strict';

const Lab = require('lab');
const Code = require('code');
const StatusEntry = require('../../../server/models/status-entry');


const lab = exports.lab = Lab.script();


lab.experiment('Status Entry Class', () => {

    lab.test('it instantiates an instance', (done) => {

        const statusEntry = new StatusEntry({});

        Code.expect(statusEntry).to.be.an.instanceOf(StatusEntry);

        done();
    });
});
