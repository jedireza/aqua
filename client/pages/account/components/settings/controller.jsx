'use strict';
const React = require('react');
const Actions = require('../../actions');
const AccountStore = require('../../stores/account');
const PasswordStore = require('../../stores/password');
const UserStore = require('../../stores/user');
const AccountForm = require('./account-form');
const UserForm = require('./user-form');
const PasswordForm = require('./password-form');


class Component extends React.Component {
    getInitialState () {

        AccountStore.reset();
        PasswordStore.reset();
        UserStore.reset();

        Actions.getAccountSettings();
        Actions.getUserSettings();

        return this.getStateFromStores();
    }

    getStateFromStores () {

        return {
            account: AccountStore.getState(),
            user: UserStore.getState(),
            password: PasswordStore.getState()
        };
    }

    componentDidMount () {

        AccountStore.addChangeListener(this.onStoreChange);
        UserStore.addChangeListener(this.onStoreChange);
        PasswordStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        AccountStore.removeChangeListener(this.onStoreChange);
        UserStore.removeChangeListener(this.onStoreChange);
        PasswordStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState(this.getStateFromStores());
    }

    render () {

        return (
            <section className="section-settings container">
                <h1 className="page-header">Account settings</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <AccountForm data={this.state.account} />
                        <UserForm data={this.state.user} />
                        <PasswordForm data={this.state.password} />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = Component;
