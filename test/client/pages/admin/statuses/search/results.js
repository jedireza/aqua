'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const Results = require('../../../../../../client/pages/admin/statuses/search/results.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Statuses Search Results', () => {

    lab.test('it renders with and without a user information', (done) => {

        const props = {
            data: [{
                _id: 'account-happy',
                pivot: 'Account',
                name: 'Happy'
            }, {
                _id: 'account-sad',
                pivot: 'Account',
                name: 'Sad'
            }]
        };
        const ResultsEl = React.createElement(Results, props);
        const results = ReactTestUtils.renderIntoDocument(ResultsEl);

        Code.expect(results).to.exist();

        done();
    });
});
