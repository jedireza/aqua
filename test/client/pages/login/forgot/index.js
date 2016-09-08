'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/login/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
const Store = require('../../../../../client/pages/login/forgot/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Forgot = Proxyquire('../../../../../client/pages/login/forgot/index.jsx', {
    '../actions': stub.Actions
});


lab.experiment('Login Forgot Form', () => {

    lab.test('it renders', (done) => {

        const ForgotEl = React.createElement(Forgot, {});
        const forgot = ReactTestUtils.renderIntoDocument(ForgotEl);

        Code.expect(forgot).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const ForgotEl = React.createElement(Forgot, {});

        ReactDOM.render(ForgotEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', (done) => {

        const ForgotEl = React.createElement(Forgot, {});
        const form = ReactTestUtils.renderIntoDocument(ForgotEl);

        Store.dispatch({
            type: Constants.FORGOT
        });

        Code.expect(form.state.loading).to.be.true();

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.forgot = function () {

            done();
        };

        const ForgotEl = React.createElement(Forgot, {});
        const forgot = ReactTestUtils.renderIntoDocument(ForgotEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(forgot, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const ForgotEl = React.createElement(Forgot, {});
        const forgot = ReactTestUtils.renderIntoDocument(ForgotEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(forgot, 'button');

        Store.dispatch({
            type: Constants.FORGOT
        });

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const ForgotEl = React.createElement(Forgot, {});
        const forgot = ReactTestUtils.renderIntoDocument(ForgotEl);

        Store.dispatch({
            type: Constants.FORGOT_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(forgot, 'alert-success');

        Code.expect(alerts.length).to.equal(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const ForgotEl = React.createElement(Forgot, {});
        const forgot = ReactTestUtils.renderIntoDocument(ForgotEl);

        Store.dispatch({
            type: Constants.FORGOT_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'major fail'
            }
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(forgot, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
