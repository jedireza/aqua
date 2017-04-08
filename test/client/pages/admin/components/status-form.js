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
const Form = Proxyquire('../../../../../client/pages/admin/components/status-form.jsx', {
    './actions': stub.Actions
});
const defaultProps = {
    current: undefined,
    hasError: {},
    help: {},
    log: [],
    newStatus: '',
    options: [{
        _id: 'some-foo',
        name: 'Some Foo'
    }, {
        _id: 'some-bar',
        name: 'Some Bar'
    }],
    saveAction: () => {}
};


lab.experiment('Status Form', () => {

    lab.test('it renders', (done) => {

        const props = Object.assign({}, defaultProps, {
            current: undefined,
            log: [{
                name: 'Some Status',
                userCreated: {
                    name: 'stimpson'
                },
                timeCreated: new Date()
            }]
        });
        const FormEl = React.createElement(Form, props);
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it handles a submit event', (done) => {

        const props = Object.assign({}, defaultProps, {
            saveAction: function () {

                done();
            }
        });
        const FormEl = React.createElement(Form, props);
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
