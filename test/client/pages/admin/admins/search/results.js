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
                _id: 'abcxyz',
                name: {
                    first: 'Ren',
                    middle: '',
                    last: 'Hoek'
                }
            }, {
                _id: 'xyzabc',
                name: {
                    first: 'Stimpson',
                    middle: '',
                    last: 'Cat'
                },
                user: {
                    name: 'stimpy'
                }
            }]
        };
        const ResultsEl = React.createElement(Results, props);
        const results = ReactTestUtils.renderIntoDocument(ResultsEl);

        Code.expect(results).to.exist();

        done();
    });
});
