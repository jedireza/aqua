'use strict';
const React = require('react');
const ReactRouter = require('react-router-dom');


const Link = ReactRouter.Link;


class NotFoundPage extends React.Component {
    render() {

        return (
            <section className="container">
                <h1 className="page-header">Not Found</h1>
                <p>That route didn't match any handlers.</p>
                <Link to="home">Go to home screen</Link>
            </section>
        );
    }
}


module.exports = NotFoundPage;
