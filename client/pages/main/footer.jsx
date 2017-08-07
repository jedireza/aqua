'use strict';
const React = require('react');
const ReactRouter = require('react-router-dom');


const Link = ReactRouter.Link;


class Footer extends React.Component {
    render() {

        const year = new Date().getFullYear();

        return (
            <div className="footer">
                <div className="container">
                    <span className="copyright pull-right">
                        &#169; {year} Acme, Inc.
                    </span>
                    <ul className="links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}


module.exports = Footer;
