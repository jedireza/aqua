var React = require('react');
var ReactRouter = require('react-router');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var IdentityForm = require('./IdentityForm.jsx');
var RolesForm = require('./RolesForm.jsx');
var PasswordForm = require('./PasswordForm.jsx');
var DeleteForm = require('./DeleteForm.jsx');
var UserStore = require('../../stores/User');
var Actions = require('../../actions/User');


var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {

        UserStore.resetIdentity();
        UserStore.resetPassword();
        UserStore.resetDelete();

        Actions.getIdentity(this.props.params);

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
                        <Link to="/admin/users">Users</Link> / Error
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
                    <Link to="/admin/users">Users</Link> / {this.state.identity.username}
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
