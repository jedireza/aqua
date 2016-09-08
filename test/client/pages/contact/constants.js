'use strict';
const Code = require('code');
const Constants = require('../../../../client/pages/contact/constants');
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('Contact Constants', () => {

    lab.test('it loads', (done) => {

        Code.expect(Constants).to.exist();

        done();
    });
});
