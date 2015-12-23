'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const DetailsForm = require('./details-form.jsx');
const PermissionsForm = require('./permissions-form.jsx');
const DeleteForm = require('./delete-form');
const AdminGroupStore = require('../../stores/admin-group');
const Actions = require('../../actions/admin-group');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        AdminGroupStore.resetDetails();
        AdminGroupStore.resetPermissions();
        AdminGroupStore.resetDelete();

        Actions.getDetails(this.props.params);

        return {
            details: AdminGroupStore.getDetails(),
            permissions: AdminGroupStore.getPermissions(),
            delete: AdminGroupStore.getDelete()
        };
    }

    componentDidMount () {

        AdminGroupStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        AdminGroupStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState({
            details: AdminGroupStore.getDetails(),
            permissions: AdminGroupStore.getPermissions(),
            delete: AdminGroupStore.getDelete()
        });
    }

    render () {

        if (this.state.details.hydrated && this.state.details.fetchFailure) {
            return (
                <section className="section-admin-group-details container">
                    <h1 className="page-header">
                        <Link to="/admin/admin-groups">Admin Groups</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.details.error}
                    </div>
                </section>
            );
        }

        return (
            <section className="section-admin-group-details container">
                <h1 className="page-header">
                    <Link to="/admin/admin-groups">Admin Groups</Link> / {this.state.details.name}
                </h1>
                <div className="row">
                    <div className="col-sm-6">
                        <DetailsForm data={this.state.details} />
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
