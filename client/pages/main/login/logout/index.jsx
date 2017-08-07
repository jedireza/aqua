'use strict';
const Actions = require('../actions');
const React = require('react');
const ReactHelmet = require('react-helmet');
const ReactRouter = require('react-router-dom');
const Store = require('./store');


const Helmet = ReactHelmet.Helmet;
const Link = ReactRouter.Link;


class LogoutPage extends React.Component {
    constructor(props) {

        super(props);

        this.input = {};
        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        Actions.logout();
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    render() {

        const alerts = [];

        if (this.state.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Logout successful.
            </div>);
        }
        else if (this.state.error) {
            alerts.push(<div key="danger" className="alert alert-warning">
                {this.state.error}
            </div>);
        }

        return (
            <section className="container">
                <Helmet>
                    <title>Sign out</title>
                </Helmet>
                <div className="container">
                    <h1 className="page-header">Sign out</h1>
                    <div className="row">
                        <div className="col-sm-6">
                            {alerts}
                            <Link to="/login" className="btn btn-link">
                                Sign in again
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = LogoutPage;
