'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/login/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
const Store = require('../../../../../client/pages/login/reset/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Reset = Proxyquire('../../../../../client/pages/login/reset/index.jsx', {
    '../actions': stub.Actions
});


lab.experiment('Login Reset Form', () => {

    const params = {
        email: 'ren@stimpy',
        key: 'abcxyz'
    };

    lab.test('it renders', (done) => {

        const ResetEl = React.createElement(Reset, { params });
        const reset = ReactTestUtils.renderIntoDocument(ResetEl);

        Code.expect(reset).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const ResetEl = React.createElement(Reset, { params });

        ReactDOM.render(ResetEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', (done) => {

        const ResetEl = React.createElement(Reset, { params });
        const reset = ReactTestUtils.renderIntoDocument(ResetEl);

        Store.dispatch({
            type: Constants.RESET
        });

        Code.expect(reset.state.loading).to.be.true();

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.reset = function () {

            done();
        };

        const ResetEl = React.createElement(Reset, { params });
        const reset = ReactTestUtils.renderIntoDocument(ResetEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(reset, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const ResetEl = React.createElement(Reset, { params });
        const reset = ReactTestUtils.renderIntoDocument(ResetEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(reset, 'button');

        Store.dispatch({
            type: Constants.RESET
        });

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const ResetEl = React.createElement(Reset, { params });
        const reset = ReactTestUtils.renderIntoDocument(ResetEl);

        Store.dispatch({
            type: Constants.RESET_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(reset, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const ResetEl = React.createElement(Reset, { params });
        const reset = ReactTestUtils.renderIntoDocument(ResetEl);

        Store.dispatch({
            type: Constants.RESET_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'major fail'
            }
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(reset, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
