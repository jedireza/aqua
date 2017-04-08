'use strict';
const Alert = require('../../../client/components/alert.jsx');
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Alert', () => {

    lab.test('it renders', (done) => {

        const AlertEl = React.createElement(Alert, {});
        const alert = ReactTestUtils.renderIntoDocument(AlertEl);

        Code.expect(alert).to.exist();

        done();
    });

    lab.test('it renders with a close button and handles the click event', (done) => {

        const AlertEl = React.createElement(Alert, {
            onClose: function () {

                done();
            }
        });
        const alert = ReactTestUtils.renderIntoDocument(AlertEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(alert, 'button');

        Code.expect(alert).to.exist();
        Code.expect(button).to.exist();

        ReactTestUtils.Simulate.click(button);
    });
});
