'use strict';
const React = require('react');
const ReactRouter = require('react-router');


const Link = ReactRouter.Link;


class Component extends React.Component {
    render () {

        return (
            <section className="section-not-found container">
                <h1 className="page-header">Not Found</h1>
                <p>That route didn't match any handlers.</p>
                <Link to="/login">Back to login</Link>
            </section>
        );
    }
}


module.exports = Component;
