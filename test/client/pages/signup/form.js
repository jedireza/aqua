'use strict';
const Code = require('code');
const Constants = require('../../../../client/pages/signup/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {},
    Store: {}
};
const Form = Proxyquire('../../../../client/pages/signup/form.jsx', {
    './actions': stub.Actions,
    './store': stub.Store
});


lab.experiment('Sign Up Form', () => {

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


    lab.test('it handles a store change', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        stub.Store.dispatch({
            type: Constants.REGISTER
        });

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.sendRequest = function () {

            done();
        };

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        stub.Store.dispatch({
            type: Constants.REGISTER
        });

        const button = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.disabled).to.be.true();
        done();
    });


    lab.test('it renders with success state', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        stub.Store.dispatch({
            type: Constants.REGISTER_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        stub.Store.dispatch({
            type: Constants.REGISTER_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'major fail'
            }
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
