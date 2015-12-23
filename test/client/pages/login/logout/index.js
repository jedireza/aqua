'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/login/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
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


lab.experiment('Login Logout Form', () => {

    lab.test('it renders', (done) => {

        const LogoutEl = React.createElement(Logout, {});
        const logout = ReactTestUtils.renderIntoDocument(LogoutEl);

        Code.expect(logout).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const LogoutEl = React.createElement(Logout, {});

        ReactDOM.render(LogoutEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', (done) => {

        const LogoutEl = React.createElement(Logout, {});
        const logout = ReactTestUtils.renderIntoDocument(LogoutEl);

        Store.dispatch({
            type: Constants.LOGOUT
        });

        Code.expect(logout.state.loading).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const LogoutEl = React.createElement(Logout, {});
        const logout = ReactTestUtils.renderIntoDocument(LogoutEl);

        Store.dispatch({
            type: Constants.LOGOUT_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(logout, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const LogoutEl = React.createElement(Logout, {});
        const logout = ReactTestUtils.renderIntoDocument(LogoutEl);

        Store.dispatch({
            type: Constants.LOGOUT_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'major fail'
            }
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(logout, 'alert-warning');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
