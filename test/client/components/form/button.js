'use strict';
const Button = require('../../../../client/components/form/button.jsx');
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Button', () => {

    lab.test('it renders', (done) => {

        const props = {
            children: 'Hi'
        };
        const ButtonEl = React.createElement(Button, props);
        const button = ReactTestUtils.renderIntoDocument(ButtonEl);
        const buttonTag = ReactTestUtils.findRenderedDOMComponentWithTag(button, 'button');

        Code.expect(buttonTag.textContent).to.equal('Hi');
        done();
    });


    lab.test('it handles as click event', (done) => {

        const props = {
            children: 'Hi',
            onClick: function (event) {

                Code.expect(event).to.exist();
                done();
            }
        };
        const ButtonEl = React.createElement(Button, props);
        const button = ReactTestUtils.renderIntoDocument(ButtonEl);
        const buttonTag = ReactTestUtils.findRenderedDOMComponentWithTag(button, 'button');

        ReactTestUtils.Simulate.click(buttonTag);
    });
});
