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
const Form = Proxyquire('../../../../../client/pages/account/settings/user-form.jsx', {
    './actions': stub.Actions
});


lab.experiment('Account Settings User Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const FormEl = React.createElement(Form, {});

        ReactDOM.render(FormEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it updates props with new input state data', (done) => {

        const container = document.createElement('div');

        // initial render
        let FormEl = React.createElement(Form, {});
        ReactDOM.render(FormEl, container);

        // update props and render again
        FormEl = React.createElement(Form, {
            username: 'pal',
            email: 'friend@pal'
        });
        ReactDOM.render(FormEl, container);

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.saveUser = function () {

            done();
        };

        const FormEl = React.createElement(Form, {
            hydrated: true,
            hasError: {},
            help: {}
        });
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const props = {
            hydrated: true,
            loading: true,
            hasError: {},
            help: {},
            username: 'pal',
            email: 'friend@pal'
        };
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const props = {
            hydrated: true,
            loading: false,
            showSaveSuccess: true,
            hasError: {},
            help: {},
            username: 'pal',
            email: 'friend@pal'
        };
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const props = {
            hydrated: true,
            loading: false,
            showSaveSuccess: false,
            error: 'sorry pal',
            hasError: {},
            help: {},
            username: 'pal',
            email: 'friend@pal'
        };
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
