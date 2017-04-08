'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../../../client/pages/admin/accounts/details/user-form.jsx', {
    './actions': stub.Actions
});
const defaultProps = {
    hasError: {},
    help: {},
    id: undefined
};
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Admin Accounts User Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it prevents a submit event (unconfirmed)', (done) => {

        const confirm = global.window.confirm;

        global.window.confirm = function () {

            global.window.confirm = confirm;

            done();

            return false;
        };

        const props = Object.assign({}, defaultProps, {
            id: 'abcxyz',
            accountId: 'axbycz'
        });
        const FormEl = React.createElement(Form, props);
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it handles a submit event (unlink)', (done) => {

        const confirm = global.window.confirm;

        global.window.confirm = function () {

            global.window.confirm = confirm;

            return true;
        };

        stub.Actions.unlinkUser = function () {

            done();
        };

        const props = Object.assign({}, defaultProps, {
            id: 'abcxyz',
            accountId: 'axbycz'
        });
        const FormEl = React.createElement(Form, props);
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it handles a submit event (link)', (done) => {

        stub.Actions.linkUser = function () {

            done();
        };

        const FormEl = React.createElement(Form, defaultProps);
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const props = Object.assign({}, defaultProps, {
            loading: true
        });
        const FormEl = React.createElement(Form, props);
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders showing save success alert', (done) => {

        const props = Object.assign({}, defaultProps, {
            showSaveSuccess: true
        });
        const FormEl = React.createElement(Form, props);
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);
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
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
