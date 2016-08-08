'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('../actions');
const LogoutStore = require('../stores/logout');


const Link = ReactRouter.Link;
const History = ReactRouter.History;


class Component extends React.Component {
    getInitialState () {

        LogoutStore.reset();
        return LogoutStore.getState();
    }

    componentDidMount () {

        LogoutStore.addChangeListener(this.onStoreChange);
        Actions.logout();
    }

    componentWillUnmount () {

        LogoutStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState(LogoutStore.getState());
    }

    render () {

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
            <section>
                <h1 className="page-header">Sign out</h1>
                {alerts}
                <Link to="/login" className="btn btn-link">Back to login</Link>
            </section>
        );
    }
}


module.exports = Component;
