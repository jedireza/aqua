'use strict';
const Code = require('code');
const Constants = require('../../../../client/pages/contact/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
const Store = require('../../../../client/pages/contact/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../client/pages/contact/form.jsx', {
    './actions': stub.Actions
});


lab.experiment('Contact Form', () => {

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

        Store.dispatch({
            type: Constants.SEND_MESSAGE
        });

        Code.expect(form.state.loading).to.be.true();

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.sendMessage = function () {

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

        Store.dispatch({
            type: Constants.SEND_MESSAGE
        });

        const button = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Store.dispatch({
            type: Constants.SEND_MESSAGE_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Store.dispatch({
            type: Constants.SEND_MESSAGE_RESPONSE,
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
