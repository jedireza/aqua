'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../../../client/pages/admin/users/search/create-new-form.jsx', {
    './actions': stub.Actions
});
const defaultProps = {
    ref: function () {

        if (defaultProps.ref.impl) {
            defaultProps.ref.impl.apply(null, arguments);
        }
    },
    hasError: {},
    help: {},
    username: '',
    email: '',
    password: ''
};


lab.experiment('Admin Users Create New Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it focuses on the username field when the component is update and showing', (done) => {

        const container = document.createElement('div');

        defaultProps.ref.impl = function (form) {

            defaultProps.ref.impl = undefined;

            form.els.username.input.onfocus = function () {

                done();
            };
        };

        // initial render
        let FormEl = React.createElement(Form, defaultProps);
        ReactDOM.render(FormEl, container);

        // update props and render again
        let props = Object.assign({}, defaultProps, {
            show: false
        });
        FormEl = React.createElement(Form, props);
        ReactDOM.render(FormEl, container);

        // update props and render again
        props = Object.assign({}, defaultProps, {
            show: true
        });
        FormEl = React.createElement(Form, props);
        ReactDOM.render(FormEl, container);
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.createNew = function () {

            done();
        };

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders showing error alert', (done) => {

        const props = Object.assign({}, defaultProps, {
            error: 'sorry pal'
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
