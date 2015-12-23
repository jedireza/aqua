'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ClassNames = require('classnames');


const Link = ReactRouter.Link;
const propTypes = {
    location: React.PropTypes.object
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

        return ClassNames({
            active: this.props.location.pathname.match(pathPattern)
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
            <div className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/admin">
                            <img
                                className="navbar-logo"
                                src="/public/media/logo-square-inverse.png"
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
                            <li className={this.isPathActive(/^\/admin\/accounts/)}>
                                <Link to="/admin/accounts">Accounts</Link>
                            </li>
                            <li className={this.isPathActive(/^\/admin\/admins/)}>
                                <Link to="/admin/admins">Admins</Link>
                            </li>
                            <li className={this.isPathActive(/^\/admin\/admin-groups/)}>
                                <Link to="/admin/admin-groups">Admin Groups</Link>
                            </li>
                            <li className={this.isPathActive(/^\/admin\/statuses/)}>
                                <Link to="/admin/statuses">Statuses</Link>
                            </li>
                            <li className={this.isPathActive(/^\/admin\/users/)}>
                                <Link to="/admin/users">Users</Link>
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
