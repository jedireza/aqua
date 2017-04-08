'use strict';
const Navbar = require('./navbar.jsx');
const PropTypes = require('prop-types');
const React = require('react');


const propTypes = {
    activeTab: PropTypes.string,
    children: PropTypes.node,
    feet: PropTypes.node,
    neck: PropTypes.node,
    title: PropTypes.string
};

class DefaultLayout extends React.Component {
    render() {

        const year = new Date().getFullYear();

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/public/core.min.css" />
                    <link rel="stylesheet" href="/public/layouts/default.min.css" />
                    <link rel="shortcut icon" href="/public/media/favicon.ico" />
                    {this.props.neck}
                </head>
                <body>
                    <Navbar activeTab={this.props.activeTab} />
                    <div className="page">
                        <div className="container">
                            {this.props.children}
                        </div>
                    </div>
                    <div className="footer">
                        <div className="container">
                            <span className="copyright pull-right">
                                &copy; {year} Acme, Inc.
                            </span>
                            <ul className="links">
                                <li><a href="/">Home</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <script src="/public/core.min.js"></script>
                    {this.props.feet}
                </body>
            </html>
        );
    }
}

DefaultLayout.propTypes = propTypes;


module.exports = DefaultLayout;
