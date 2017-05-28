'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/login/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');
const Store = require('../../../../../client/pages/login/reset/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Reset = Proxyquire('../../../../../client/pages/login/reset/index.jsx', {
    '../actions': stub.Actions
});
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Login Reset Form', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const params = {
            match: {
                params: {
                    email: 'ren@stimpy',
                    key: 'abcxyz'
                }
            }
        };
        const ResetEl = React.createElement(Reset, params);

        RootEl = React.createElement(MemoryRouter, {}, ResetEl);

        done();
    });


    lab.test('it renders', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);

        Code.expect(root).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');

        ReactDOM.render(RootEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const reset = ReactTestUtils.findRenderedComponentWithType(root, Reset);

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

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(root, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(root, 'button');

        Store.dispatch({
            type: Constants.RESET
        });

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);

        Store.dispatch({
            type: Constants.RESET_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);

        Store.dispatch({
            type: Constants.RESET_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'major fail'
            }
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
