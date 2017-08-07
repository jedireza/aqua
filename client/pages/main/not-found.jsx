'use strict';
const React = require('react');
const ReactHelmet = require('react-helmet');
const RouteStatus = require('../../components/route-status.jsx');


const Helmet = ReactHelmet.Helmet;


class NotFoundPage extends React.Component {
    render() {

        return (
            <RouteStatus code={404}>
                <section className="container">
                    <Helmet>
                        <title>Page not found</title>
                    </Helmet>
                    <h1 className="page-header">Page not found</h1>
                    <p>We couldn’t find the page you requested.</p>
                </section>
            </RouteStatus>
        );
    }
}


module.exports = NotFoundPage;
