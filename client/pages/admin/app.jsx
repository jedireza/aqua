'use strict';
const React = require('react');
const Navbar = require('./navbar.jsx');
const Footer = require('./footer.jsx');


const propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object
};


class App extends React.Component {
    render() {

        return (
            <div>
                <Navbar location={this.props.location} />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

App.propTypes = propTypes;


module.exports = App;
