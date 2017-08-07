'use strict';
const ClassNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');


const Link = ReactRouter.Link;
const propTypes = {
    location: PropTypes.object
};


class Navbar extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            navBarOpen: false
        };
    }

    componentWillReceiveProps() {

        this.setState({ navBarOpen: false });
    }

    isPathActive(pathPattern) {

        let isActive = false;

        if (typeof pathPattern === 'string') {
            isActive = this.props.location.pathname === pathPattern;
        }
        else {
            isActive = this.props.location.pathname.match(pathPattern);
        }

        return ClassNames({
            active: isActive
        });
    }

    toggleMenu() {

        this.setState({ navBarOpen: !this.state.navBarOpen });
    }

    render() {

        const navBarCollapse = ClassNames({
            'navbar-collapse': true,
            collapse: !this.state.navBarOpen
        });

        return (
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">
                            <img
                                className="navbar-logo"
                                src="/public/media/logo-square.png"
                            />
                            <span className="navbar-brand-label">Aqua</span>
                        </Link>
                        <button
                            className="navbar-toggle collapsed"
                            onClick={this.toggleMenu.bind(this)}>

                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className={navBarCollapse}>
                        <ul className="nav navbar-nav">
                            <li className={this.isPathActive('/')}>
                                <Link to="/">Home</Link>
                            </li>
                            <li className={this.isPathActive('/about')}>
                                <Link to="/about">About</Link>
                            </li>
                            <li className={this.isPathActive('/signup')}>
                                <Link to="/signup">Signup</Link>
                            </li>
                            <li className={this.isPathActive('/contact')}>
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className={this.isPathActive(/^\/login/)}>
                                <Link to="/login">
                                    <i className="fa fa-user"></i> Sign in
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

Navbar.propTypes = propTypes;


module.exports = Navbar;
