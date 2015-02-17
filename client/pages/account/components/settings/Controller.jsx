var React = require('react/addons');
var Actions = require('../../Actions');
var AccountStore = require('../../stores/Account');
var PasswordStore = require('../../stores/Password');
var UserStore = require('../../stores/User');
var AccountForm = require('./AccountForm.react');
var UserForm = require('./UserForm.react');
var PasswordForm = require('./PasswordForm.react');


var Component = React.createClass({
    getInitialState: function () {

        AccountStore.reset();
        PasswordStore.reset();
        UserStore.reset();

        Actions.getAccountSettings();
        Actions.getUserSettings();

        return this.getStateFromStores();
    },
    getStateFromStores: function () {

        return {
            account: AccountStore.getState(),
            user: UserStore.getState(),
            password: PasswordStore.getState(),
        };
    },
    componentDidMount: function () {

        AccountStore.addChangeListener(this.onStoreChange);
        UserStore.addChangeListener(this.onStoreChange);
        PasswordStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        AccountStore.removeChangeListener(this.onStoreChange);
        UserStore.removeChangeListener(this.onStoreChange);
        PasswordStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState(this.getStateFromStores());
    },
    render: function () {

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
});


module.exports = Component;
