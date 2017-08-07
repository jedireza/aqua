'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');
const SignupPage = require('../../../../../client/pages/main/signup/index.jsx');


const lab = exports.lab = Lab.script();
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Signup Page', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const SignupPageEl = React.createElement(SignupPage, {});

        RootEl = React.createElement(MemoryRouter, {}, SignupPageEl);

        done();
    });


    lab.test('it renders', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const page = ReactTestUtils.findRenderedComponentWithType(root, SignupPage);

        Code.expect(page).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');

        ReactDOM.render(RootEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });
});
