'use strict';
const Layout = require('../layouts/default.jsx');
const Package = require('../../../package.json');
const React = require('react');


class HomePage extends React.Component {
    render() {

        const neck = <link rel='stylesheet' href="/public/pages/home.min.css" />;

        return (
            <Layout
                title="Aqua"
                neck={neck}
                activeTab="home">

                <div className="jumbotron">
                    <h1>Success</h1>
                    <div>
                        <p className="lead">Your Node.js website and user system is running. (v{Package.version})</p>
                        <div>
                            <a className="btn btn-primary btn-lg" href="/signup">
                                Create an account
                            </a>
                            &nbsp; or &nbsp;
                            <a className="btn btn-warning btn-lg" href="/login/forgot">
                                Reset your password
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <h3>About us</h3>
                                <p>
                                    At vero eos et accusamus et iusto odio
                                    dignissimos ducimus qui blanditiis
                                    praesentium voluptatum deleniti atque
                                    corrupti.
                                </p>
                                <a href="/about" className="btn btn-default btn-block">
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <h3>Sign up</h3>
                                <p>
                                    At vero eos et accusamus et iusto odio
                                    dignissimos ducimus qui blanditiis
                                    praesentium voluptatum deleniti atque
                                    corrupti.
                                </p>
                                <a href="/signup" className="btn btn-default btn-block">
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <h3>Contact us</h3>
                                <p>
                                    At vero eos et accusamus et iusto odio
                                    dignissimos ducimus qui blanditiis
                                    praesentium voluptatum deleniti atque
                                    corrupti.
                                </p>
                                <a href="/contact" className="btn btn-default btn-block">
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}


module.exports = HomePage;
