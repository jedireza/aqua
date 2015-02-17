var React = require('react/addons');
var ReactRouter = require('react-router');
var IdentityForm = require('./IdentityForm.react');
var RolesForm = require('./RolesForm.react');
var PasswordForm = require('./PasswordForm.react');
var DeleteForm = require('./DeleteForm.react');
var UserStore = require('../../stores/User');
var Actions = require('../../actions/User');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;
var State = ReactRouter.State;
var Navigation = ReactRouter.Navigation;


var Component = React.createClass({
    mixins: [ LinkedState, State, Navigation ],
    getInitialState: function () {

        UserStore.resetIdentity();
        UserStore.resetPassword();
        UserStore.resetDelete();

        Actions.getIdentity(this.getParams());

        return {
            identity: UserStore.getIdentity(),
            password: UserStore.getPassword(),
            delete: UserStore.getDelete()
        };
    },
    componentDidMount: function () {

        UserStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        UserStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            identity: UserStore.getIdentity(),
            password: UserStore.getPassword(),
            delete: UserStore.getDelete()
        });
    },
    render: function () {

        if (this.state.identity.hydrated && this.state.identity.fetchFailure) {
            return (
                <section className="section-user-details container">
                    <h1 className="page-header">
                        <Link to="users">Users</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.identity.error}
                    </div>
                </section>
            );
        }

        return (
            <section className="section-user-details container">
                <h1 className="page-header">
                    <Link to="users">Users</Link> / {this.state.identity.username}
                </h1>
                <div className="row">
                    <div className="col-sm-6">
                        <IdentityForm data={this.state.identity} />
                        <RolesForm data={this.state.identity} />
                        <PasswordForm
                            data={this.state.password}
                            identity={this.state.identity}
                        />
                        <DeleteForm
                            data={this.state.delete}
                            details={this.state.identity}
                        />
                    </div>
                </div>
            </section>
        );
    }
});


module.exports = Component;
