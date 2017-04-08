'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');
const Results = require('../../../../../../client/pages/admin/users/search/results.jsx');


const lab = exports.lab = Lab.script();
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Admin Users Search Results', () => {

    lab.test('it renders with and without a user information', (done) => {

        const props = {
            data: [{
                _id: 'abcxyz',
                username: 'ren',
                email: 'ren@hoek',
                isActive: true
            }, {
                _id: 'xyzabc',
                username: 'stimpy',
                email: 'stimpy@cat',
                isActive: false
            }]
        };
        const ResultsEl = React.createElement(Results, props);
        const RootEl = React.createElement(MemoryRouter, {}, ResultsEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const results = ReactTestUtils.findRenderedComponentWithType(root, Results);

        Code.expect(results).to.exist();

        done();
    });
});
