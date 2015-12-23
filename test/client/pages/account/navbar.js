'use strict';
const Code = require('code');
const Lab = require('lab');
const Navbar = require('../../../../client/pages/account/navbar.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Account Navbar', () => {

    const defaultProps = { location: {} };


    lab.test('it renders', (done) => {

        const NavbarEl = React.createElement(Navbar, defaultProps);
        const mainElement = ReactTestUtils.renderIntoDocument(NavbarEl);

        Code.expect(mainElement).to.exist();

        done();
    });


    lab.test('it toggles the menu', (done) => {

        const NavbarEl = React.createElement(Navbar, defaultProps);
        const mainElement = ReactTestUtils.renderIntoDocument(NavbarEl);
        const button = ReactTestUtils.findRenderedDOMComponentWithTag(mainElement, 'button');
        const menuDiv = ReactTestUtils.findRenderedDOMComponentWithClass(mainElement, 'navbar-collapse');
        const menuDivNode = menuDiv;

        Code.expect(menuDivNode.className).to.equal('navbar-collapse collapse');
        ReactTestUtils.Simulate.click(button);

        Code.expect(menuDivNode.className).to.equal('navbar-collapse');

        done();
    });


    lab.test('it receives new props', (done) => {

        const container = document.createElement('div');

        // initial render
        let NavbarEl = React.createElement(Navbar, defaultProps);
        ReactDOM.render(NavbarEl, container);

        // send props again by rendering
        NavbarEl = React.createElement(Navbar, defaultProps);
        ReactDOM.render(NavbarEl, container);

        done();
    });
});
