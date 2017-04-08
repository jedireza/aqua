'use strict';
const Code = require('code');
const Lab = require('lab');
const Navbar = require('../../../../client/pages/account/navbar.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Account Navbar', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const NavbarEl = React.createElement(Navbar, {
            location: {}
        });

        RootEl = React.createElement(MemoryRouter, {}, NavbarEl);

        done();
    });


    lab.test('it renders', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const navbar = ReactTestUtils.findRenderedComponentWithType(root, Navbar);

        Code.expect(navbar).to.exist();

        done();
    });


    lab.test('it toggles the menu', (done) => {

        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(root, 'button');
        const menuDiv = ReactTestUtils.findRenderedDOMComponentWithClass(root, 'navbar-collapse');
        const menuDivNode = menuDiv;

        Code.expect(menuDivNode.className).to.equal('navbar-collapse collapse');
        ReactTestUtils.Simulate.click(button);

        Code.expect(menuDivNode.className).to.equal('navbar-collapse');

        done();
    });


    lab.test('it receives new props', (done) => {

        const container = document.createElement('div');

        // initial render
        ReactDOM.render(RootEl, container);

        // send props again by rendering
        ReactDOM.render(RootEl, container);

        done();
    });
});
