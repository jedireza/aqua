'use strict';
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const Store = require('../../../../../client/pages/account/settings/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {
        getDetails: () => {},
        getUser: () => {}
    }
};
const Component = Proxyquire('../../../../../client/pages/account/settings/index.jsx', {
    './actions': stub.Actions
});
const container = global.document.createElement('div');


lab.experiment('Account Settings Page', () => {

    lab.afterEach((done) => {

        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it renders', (done) => {

        const ComponentEl = React.createElement(Component, {});

        ReactDOM.render(ComponentEl, container);

        done();
    });


    lab.test('it handles a store change', (done) => {

        const ComponentEl = React.createElement(Component, {});

        ReactDOM.render(ComponentEl, container);

        Store.dispatch({
            type: 'UNKNOWN'
        });

        done();
    });
});
