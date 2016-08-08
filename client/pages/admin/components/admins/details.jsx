'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const DetailsForm = require('./details-form.jsx');
const UserForm = require('./user-form');
const GroupsForm = require('./groups-form.jsx');
const PermissionsForm = require('./permissions-form.jsx');
const DeleteForm = require('./delete-form');
const AdminStore = require('../../stores/admin');
const AdminGroupStore = require('../../stores/admin-group');
const Actions = require('../../actions/admin');
const GroupActions = require('../../actions/admin-group');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        AdminStore.resetDetails();
        AdminStore.resetPermissions();
        AdminStore.resetUser();
        AdminStore.resetGroups();
        AdminStore.resetDelete();
        AdminGroupStore.resetResults();

        Actions.getDetails(this.props.params);
        GroupActions.getResults({ fields: 'name', limit: 99 });

        return {
            details: AdminStore.getDetails(),
            permissions: AdminStore.getPermissions(),
            user: AdminStore.getUser(),
            groups: AdminStore.getGroups(),
            delete: AdminStore.getDelete(),
            adminGroups: AdminGroupStore.getResults()
        };
    }

    componentDidMount () {

        AdminStore.addChangeListener(this.onStoreChange);
        AdminGroupStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        AdminStore.removeChangeListener(this.onStoreChange);
        AdminGroupStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState({
            details: AdminStore.getDetails(),
            user: AdminStore.getUser(),
            groups: AdminStore.getGroups(),
            permissions: AdminStore.getPermissions(),
            delete: AdminStore.getDelete(),
            adminGroups: AdminGroupStore.getResults()
        });
    }

    render () {

        if (this.state.details.hydrated && this.state.details.fetchFailure) {
            return (
                <section className="section-admin-details container">
                    <h1 className="page-header">
                        <Link to="/admin/admins">Admins</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.details.error}
                    </div>
                </section>
            );
        }

        return (
            <section className="section-admin-details container">
                <h1 className="page-header">
                    <Link to="/admin/admins">Admins</Link> / {this.state.details.name.first} {this.state.details.name.last}
                </h1>
                <div className="row">
                    <div className="col-sm-8">
                        <DetailsForm data={this.state.details} />
                        <UserForm
                            details={this.state.details}
                            data={this.state.user}
                        />
                        <GroupsForm
                            details={this.state.details}
                            data={this.state.groups}
                            list={this.state.adminGroups}
                        />
                        <PermissionsForm
                            details={this.state.details}
                            data={this.state.permissions}
                        />
                        <DeleteForm
                            details={this.state.details}
                            data={this.state.delete}
                        />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = Component;
