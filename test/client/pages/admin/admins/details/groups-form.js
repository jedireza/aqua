'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../../../client/pages/admin/admins/details/groups-form.jsx', {
    './actions': stub.Actions
});
const defaultProps = {
    hasError: {},
    help: {},
    options: [
        { _id: 'sales', name: 'Sales' },
        { _id: 'service', name: 'Service' },
        { _id: 'root', name: 'Root' }
    ],
    adminId: undefined,
    groups: {}
};


lab.experiment('Admin Admins Groups Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it handles adding a new group (only when one is selected)', (done) => {

        const FormEl = React.createElement(Form, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        ReactTestUtils.Simulate.click(form.els.newGroupButton);

        Code.expect(form.state.groups).to.have.length(0);

        ReactTestUtils.Simulate.change(form.els.newGroup, {
            target: {
                name: 'newGroup',
                value: 'sales'
            }
        });
        ReactTestUtils.Simulate.click(form.els.newGroupButton);

        Code.expect(form.state.groups).to.have.length(1);

        done();
    });


    lab.test('it handles removing a group', (done) => {

        const props = Object.assign({}, defaultProps, {
            groups: {
                'sales': 'Sales',
                'service': 'Service'
            }
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const button = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'btn-warning')[0];

        Code.expect(form.state.groups).to.have.length(2);

        ReactTestUtils.Simulate.click(button);

        Code.expect(form.state.groups).to.have.length(1);

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.saveGroups = function () {

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
