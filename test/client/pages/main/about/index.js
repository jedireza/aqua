'use strict';
const AboutPage = require('../../../../../client/pages/main/about/index.jsx');
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('About Page', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const AboutPageEl = React.createElement(AboutPage, {});

        RootEl = React.createElement(MemoryRouter, {}, AboutPageEl);

        done();
    });


    lab.test('it renders', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const page = ReactTestUtils.findRenderedComponentWithType(root, AboutPage);

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
