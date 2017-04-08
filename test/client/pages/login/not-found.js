'use strict';
const Code = require('code');
const Lab = require('lab');
const NotFound = require('../../../../client/pages/login/not-found.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Login Not Found Component', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const NotFoundEl = React.createElement(NotFound, {});

        RootEl = React.createElement(MemoryRouter, {}, NotFoundEl);

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
});
