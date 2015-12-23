'use strict';
const Code = require('code');
const Lab = require('lab');
const Routes = require('../../../../client/pages/account/routes.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('Account Routes', () => {

    lab.test('it loads', (done) => {

        Code.expect(Routes).to.exist();

        done();
    });
});
