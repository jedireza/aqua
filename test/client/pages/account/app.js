'use strict';
const App = require('../../../../client/pages/account/app.jsx');
const Code = require('code');
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('Account App', () => {

    lab.test('it loads', (done) => {

        Code.expect(App).to.exist();

        done();
    });
});
