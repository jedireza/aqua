'use strict';
const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');
const ClassNames = require('classnames');


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

    classForPath(path) {

        return ClassNames({
            active: this.props.location.pathname === path
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
                        <Link className="navbar-brand" to="/account">
                            <img className="navbar-logo" src="/public/media/logo-square.png" />
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
                            <li className={this.classForPath('/account')}>
                                <Link to="/account">My account</Link>
                            </li>
                            <li className={this.classForPath('/account/settings')}>
                                <Link to="/account/settings">Settings</Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="/login/logout">Sign out</a>
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
