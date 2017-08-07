'use strict';
const Code = require('code');
const HomePage = require('../../../../../client/pages/main/home/index.jsx');
const Lab = require('lab');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Home Page', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const HomePageEl = React.createElement(HomePage, {});

        RootEl = React.createElement(MemoryRouter, {}, HomePageEl);

        done();
    });


    lab.test('it renders', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const page = ReactTestUtils.findRenderedComponentWithType(root, HomePage);

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
