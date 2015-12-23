'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/login/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
const Store = require('../../../../../client/pages/login/home/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Home = Proxyquire('../../../../../client/pages/login/home/index.jsx', {
    '../actions': stub.Actions
});


lab.experiment('Login Home Form', () => {

    lab.test('it renders', (done) => {

        const HomeEl = React.createElement(Home, {});
        const home = ReactTestUtils.renderIntoDocument(HomeEl);

        Code.expect(home).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const HomeEl = React.createElement(Home, {});

        ReactDOM.render(HomeEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', (done) => {

        const HomeEl = React.createElement(Home, {});
        const home = ReactTestUtils.renderIntoDocument(HomeEl);

        Store.dispatch({
            type: Constants.LOGIN
        });

        Code.expect(home.state.loading).to.be.true();

        done();
    });


    lab.test('it handles a submit event', (done) => {

        stub.Actions.login = function () {

            done();
        };

        const HomeEl = React.createElement(Home, {});
        const home = ReactTestUtils.renderIntoDocument(HomeEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(home, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', (done) => {

        const HomeEl = React.createElement(Home, {});
        const home = ReactTestUtils.renderIntoDocument(HomeEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(home, 'button');

        Store.dispatch({
            type: Constants.LOGIN
        });

        Code.expect(button.disabled).to.be.true();

        done();
    });


    lab.test('it renders with success state', (done) => {

        const HomeEl = React.createElement(Home, {});
        const home = ReactTestUtils.renderIntoDocument(HomeEl);

        Store.dispatch({
            type: Constants.LOGIN_RESPONSE,
            err: null
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(home, 'alert-success');

        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it renders with error state', (done) => {

        const HomeEl = React.createElement(Home, {});
        const home = ReactTestUtils.renderIntoDocument(HomeEl);

        Store.dispatch({
            type: Constants.LOGIN_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'major fail'
            }
        });

        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(home, 'alert-danger');

        Code.expect(alerts).to.have.length(1);

        done();
    });
});
