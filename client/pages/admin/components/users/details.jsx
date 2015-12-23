'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const IdentityForm = require('./identity-form.jsx');
const RolesForm = require('./roles-form.jsx');
const PasswordForm = require('./password-form');
const DeleteForm = require('./delete-form');
const UserStore = require('../../stores/user');
const Actions = require('../../actions/user');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        UserStore.resetIdentity();
        UserStore.resetPassword();
        UserStore.resetDelete();

        Actions.getIdentity(this.props.params);

        return {
            identity: UserStore.getIdentity(),
            password: UserStore.getPassword(),
            delete: UserStore.getDelete()
        };
    }

    componentDidMount () {

        UserStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        UserStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState({
            identity: UserStore.getIdentity(),
            password: UserStore.getPassword(),
            delete: UserStore.getDelete()
        });
    }

    render () {

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
}


module.exports = Component;
