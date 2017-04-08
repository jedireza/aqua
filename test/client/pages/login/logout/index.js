'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/login/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');
const Store = require('../../../../../client/pages/login/logout/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {
        logout: function () {}
    }
};
const Logout = Proxyquire('../../../../../client/pages/login/logout/index.jsx', {
    '../actions': stub.Actions
});
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Login Logout Form', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const LogoutEl = React.createElement(Logout, {});

        RootEl = React.createElement(MemoryRouter, {}, LogoutEl);

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
        const logout = ReactTestUtils.findRenderedComponentWithType(root, Logout);

        Store.dispatch({
            type: Constants.LOGOUT
        });

        Code.expect(logout.state.loading).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);

        Store.dispatch({
            type: Constants.LOGOUT_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);

        Store.dispatch({
            type: Constants.LOGOUT_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'major fail'
            }
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, 'alert-warning');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
