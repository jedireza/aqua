'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const Results = require('../../../../../../client/pages/admin/admin-groups/search/results.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Groups Search Results', () => {

    lab.test('it renders with and without a user information', (done) => {

        const props = {
            data: [{
                _id: 'sales',
                name: 'Sales'
            }, {
                _id: 'service',
                name: 'Service'
            }]
        };
        const ResultsEl = React.createElement(Results, props);
        const results = ReactTestUtils.renderIntoDocument(ResultsEl);

        Code.expect(results).to.exist();

        done();
    });
});
