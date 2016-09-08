'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const Spinner = require('../../../../client/components/form/spinner.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('Spinner', () => {

    lab.test('it renders', (done) => {

        const props = {};
        const SpinnerEl = React.createElement(Spinner, props);
        const spinner = ReactTestUtils.renderIntoDocument(SpinnerEl);
        const spinnerTag = ReactTestUtils.findRenderedDOMComponentWithTag(spinner, 'span');
        const klass = spinnerTag.getAttribute('class');

        Code.expect(klass).to.equal('hidden');
        done();
    });


    lab.test('it renders visible', (done) => {

        const props = {
            show: true
        };
        const SpinnerEl = React.createElement(Spinner, props);
        const spinner = ReactTestUtils.renderIntoDocument(SpinnerEl);
        const spinnerTag = ReactTestUtils.findRenderedDOMComponentWithTag(spinner, 'span');
        const klass = spinnerTag.getAttribute('class');

        Code.expect(klass).to.equal('');
        done();
    });


    lab.test('it renders with space on the left', (done) => {

        const props = {
            space: 'left'
        };
        const SpinnerEl = React.createElement(Spinner, props);
        const spinner = ReactTestUtils.renderIntoDocument(SpinnerEl);
        const spinnerTag = ReactTestUtils.findRenderedDOMComponentWithTag(spinner, 'span');
        const text = spinnerTag.textContent;

        Code.expect(text[0]).to.equal('\u00A0');
        done();
    });


    lab.test('it renders with space on the right', (done) => {

        const props = {
            space: 'right'
        };
        const SpinnerEl = React.createElement(Spinner, props);
        const spinner = ReactTestUtils.renderIntoDocument(SpinnerEl);
        const spinnerTag = ReactTestUtils.findRenderedDOMComponentWithTag(spinner, 'span');
        const text = spinnerTag.textContent;

        Code.expect(text[text.length - 1]).to.equal('\u00A0');
        done();
    });
});
