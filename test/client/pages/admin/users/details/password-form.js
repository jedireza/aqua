'use strict';
const Code = require('code');
const Lab = require('lab');
const ObjectAssign = require('object-assign');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../../../client/pages/admin/users/details/password-form.jsx', {
    './actions': stub.Actions
});


lab.experiment('Admin Users Password Form', () => {

    const defaultProps = {
        loading: false,
        showSaveSuccess: false,
        hasError: {},
        help: {},
        password: '',
        confirmPassword: ''
    };

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const FormEl = React.createElement(Form, defaultProps);

        ReactDOM.render(FormEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it updates props with new input state data', (done) => {

        const container = document.createElement('div');

        // initial render
        let FormEl = React.createElement(Form, defaultProps);
        ReactDOM.render(FormEl, container);

        // update props and render again
        const props = ObjectAssign({}, defaultProps, {
            password: '123',
            confirmPassword: 'abc'
        });
        FormEl = React.createElement(Form, props);
        ReactDOM.render(FormEl, container);

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.savePassword = function () {

            done();
        };

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const props = ObjectAssign({}, defaultProps, {
            loading: true
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const props = ObjectAssign({}, defaultProps, {
            showSaveSuccess: true
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const props = ObjectAssign({}, defaultProps, {
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
