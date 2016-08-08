'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ClassNames = require('classnames');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        return {
            navBarOpen: false
        };
    }

    componentWillReceiveProps () {

        this.setState({ navBarOpen: false });
    }

    isPathActive (path) {

        return ClassNames({
            active: this.context.location.pathname === path
        });
    }

    toggleMenu () {

        this.setState({ navBarOpen: !this.state.navBarOpen });
    }

    render () {

        const navBarCollapse = ClassNames({
            'navbar-collapse': true,
            collapse: !this.state.navBarOpen
        });

        return (
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="home">
                            <img className="navbar-logo" src="/public/media/logo-square.png" />
                            <span className="navbar-brand-label">Aqua</span>
                        </Link>
                        <button
                            className="navbar-toggle collapsed"
                            onClick={this.toggleMenu}>

                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className={navBarCollapse}>
                        <ul className="nav navbar-nav">
                            <li className={this.isPathActive('/account')}>
                                <Link to="/account">My account</Link>
                            </li>
                            <li className={this.isPathActive('/account/settings')}>
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


Component.contextTypes = {
    location: React.PropTypes.object
};


module.exports = Component;
