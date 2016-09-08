'use strict';
const App = require('../../../../client/pages/account/app.jsx');
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Account App Component', () => {

    lab.test('it renders', (done) => {

        const AppEl = React.createElement(App, { location: {} });
        const app = ReactTestUtils.renderIntoDocument(AppEl);

        Code.expect(app).to.exist();

        done();
    });
});
