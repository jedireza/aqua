'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const Results = require('../../../../../../client/pages/admin/admins/search/results.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Admins Search Results', () => {

    lab.test('it renders with and without a user information', (done) => {

        const props = {
            data: [{
                id: 'abcxyz',
                first: 'Ren',
                middle: '',
                last: 'Hoek'
            }, {
                id: 'xyzabc',
                first: 'Stimpson',
                middle: '',
                last: 'Cat',
                User: {
                    username: 'stimpy'
                }
            }]
        };
        const ResultsEl = React.createElement(Results, props);
        const results = ReactTestUtils.renderIntoDocument(ResultsEl);

        Code.expect(results).to.exist();

        done();
    });
});
