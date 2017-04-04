'use strict';
const App = require('../../../../client/pages/admin/app.jsx');
const Code = require('code');
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('Admin App', () => {

    lab.test('it loads', (done) => {

        Code.expect(App).to.exist();

        done();
    });
});
