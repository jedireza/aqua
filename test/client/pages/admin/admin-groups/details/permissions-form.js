'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../../../client/pages/admin/admin-groups/details/permissions-form.jsx', {
    './actions': stub.Actions
});
const defaultProps = {
    hasError: {},
    help: {},
    adminId: undefined,
    permissions: {}
};


lab.experiment('Admin Groups Permissions Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it handles adding a new permission (only when one is supplied, with a button click or enter key)', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        ReactTestUtils.Simulate.click(form.els.newPermissionButton);

        Code.expect(form.state.permissions).to.have.length(0);

        ReactTestUtils.Simulate.change(form.els.newPermission, {
            target: {
                name: 'newPermission',
                value: 'BA'
            }
        });
        ReactTestUtils.Simulate.keyDown(form.els.newPermission, { key: 'Z' });
        ReactTestUtils.Simulate.keyDown(form.els.newPermission, {
            key: 'Enter',
            which: 13
        });

        Code.expect(form.state.permissions).to.have.length(1);

        done();
    });


    lab.test('it handles toggling a permission', (done) => {

        const props = Object.assign({}, defaultProps, {
            permissions: {
                FOO: true,
                BAR: false
            }
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form.state.permissions.FOO).to.be.true();
        Code.expect(form.state.permissions.BAR).to.be.false();

        form.handleTogglePermission('FOO');
        form.handleTogglePermission('BAR');

        Code.expect(form.state.permissions.FOO).to.be.false();
        Code.expect(form.state.permissions.BAR).to.be.true();

        done();
    });


    lab.test('it handles removing a permission', (done) => {

        const props = Object.assign({}, defaultProps, {
            permissions: {
                FOO: true,
                BAR: false
            }
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const button = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'btn-warning')[0];

        Code.expect(form.state.permissions).to.have.length(2);

        ReactTestUtils.Simulate.click(button);

        Code.expect(form.state.permissions).to.have.length(1);

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.savePermissions = function () {

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
        const button = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'btn-primary')[0];

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
