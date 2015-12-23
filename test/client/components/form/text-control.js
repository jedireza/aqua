'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const TestUtils = require('react-addons-test-utils');
const TextControl = require('../../../../client/components/form/text-control.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('TextControl', () => {

    lab.test('it renders', (done) => {

        const props = {};
        const TextControlEl = React.createElement(TextControl, props);
        const textControl = TestUtils.renderIntoDocument(TextControlEl);
        const input = TestUtils.findRenderedDOMComponentWithTag(textControl, 'input');

        Code.expect(input).to.exist();

        done();
    });


    lab.test('it renders disabled', (done) => {

        const props = {
            disabled: true
        };
        const TextControlEl = React.createElement(TextControl, props);
        const textControl = TestUtils.renderIntoDocument(TextControlEl);
        const input = TestUtils.findRenderedDOMComponentWithTag(textControl, 'input');

        Code.expect(input.disabled).to.be.true();

        done();
    });


    lab.test('it returns the current value', (done) => {

        const props = {
            value: 'foo',
            onChange: function () {}
        };
        const TextControlEl = React.createElement(TextControl, props);
        const textControl = TestUtils.renderIntoDocument(TextControlEl);

        Code.expect(textControl.value()).to.equal('foo');

        done();
    });


    lab.test('it focuses on the input field', (done) => {

        const props = {
            value: 'foo',
            onChange: function () {}
        };
        const TextControlEl = React.createElement(TextControl, props);
        const textControl = TestUtils.renderIntoDocument(TextControlEl);

        textControl.focus();

        done();
    });
});
