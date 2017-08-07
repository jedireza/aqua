'use strict';
const App = require('../../../../client/pages/main/app.jsx');
const Code = require('code');
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('Main App', () => {

    lab.test('it loads', (done) => {

        Code.expect(App).to.exist();

        done();
    });
});
