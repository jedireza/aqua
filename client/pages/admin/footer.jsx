'use strict';
const React = require('react');


class Footer extends React.Component {
    render() {

        return (
            <div className="footer">
                <div className="container">
                    <span className="copyright pull-right">
                        &#169; 2014 Acme, Inc.
                    </span>
                    <ul className="links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/login/logout">Sign out</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}


module.exports = Footer;
