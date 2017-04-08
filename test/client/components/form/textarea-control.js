'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-dom/test-utils');
const TextareaControl = require('../../../../client/components/form/textarea-control.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('TextareaControl', () => {

    lab.test('it renders', (done) => {

        const props = {};
        const TextareaControlEl = React.createElement(TextareaControl, props);
        const textareaControl = ReactTestUtils.renderIntoDocument(TextareaControlEl);
        const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(textareaControl, 'textarea');

        Code.expect(textarea).to.exist();

        done();
    });


    lab.test('it renders disabled', (done) => {

        const props = {
            disabled: true
        };
        const TextareaControlEl = React.createElement(TextareaControl, props);
        const textareaControl = ReactTestUtils.renderIntoDocument(TextareaControlEl);
        const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(textareaControl, 'textarea');

        Code.expect(textarea.disabled).to.be.true();

        done();
    });


    lab.test('it returns the current value', (done) => {

        const props = {
            value: 'foo',
            onChange: function () {}
        };
        const TextareaControlEl = React.createElement(TextareaControl, props);
        const textareaControl = ReactTestUtils.renderIntoDocument(TextareaControlEl);

        Code.expect(textareaControl.value()).to.equal('foo');

        done();
    });


    lab.test('it focuses on the input field', (done) => {

        const props = {
            value: 'foo',
            onChange: function () {}
        };
        const TextareaControlEl = React.createElement(TextareaControl, props);
        const textareaControl = ReactTestUtils.renderIntoDocument(TextareaControlEl);

        textareaControl.focus();

        done();
    });
});
