'use strict';
const DetailsForm = require('./details-form.jsx');
const Actions = require('./actions');
const PasswordForm = require('./password-form.jsx');
const React = require('react');
const Store = require('./store');
const UserForm = require('./user-form.jsx');


class SettingsPage extends React.Component {
    constructor(props) {

        super(props);

        this.state = Store.getState();
    }

    componentDidMount() {

        Actions.getDetails();
        Actions.getUser();

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {

        this.unsubscribeStore();

        Actions.resetStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    render() {

        return (
            <section className="container">
                <h1 className="page-header">Account settings</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <DetailsForm {...this.state.details} />
                        <UserForm {...this.state.user} />
                        <PasswordForm {...this.state.password} />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = SettingsPage;
