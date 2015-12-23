'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const NavBar = require('./navbar');
const Footer = require('./footer');


class Component extends React.Component {
    render () {

        return (
            <div>
                <NavBar />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}


module.exports = Component;
