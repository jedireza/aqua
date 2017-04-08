'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../../../client/pages/admin/statuses/details/details-form.jsx', {
    './actions': stub.Actions
});
const defaultProps = {
    hasError: {},
    help: {},
    pivot: '',
    name: ''
};


lab.experiment('Admin Statuses Details Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it updates props with new input state data', (done) => {

        const container = document.createElement('div');

        // initial render
        let FormEl = React.createElement(Form, defaultProps);
        ReactDOM.render(FormEl, container);

        // update props and render again
        const props = Object.assign({}, defaultProps, {
            pivot: 'Account',
            name: 'Happy'
        });
        FormEl = React.createElement(Form, props);
        ReactDOM.render(FormEl, container);

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.saveDetails = function () {

            done();
        };

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const props = Object.assign({}, defaultProps, {
            loading: true
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders showing save success alert', (done) => {

        const props = Object.assign({}, defaultProps, {
            showSaveSuccess: true
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders showing error alert', (done) => {

        const props = Object.assign({}, defaultProps, {
            showSaveSuccess: false,
            error: 'sorry pal'
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
