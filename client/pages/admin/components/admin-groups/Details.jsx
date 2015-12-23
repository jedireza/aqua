var React = require('react');
var ReactRouter = require('react-router');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var DetailsForm = require('./DetailsForm.jsx');
var PermissionsForm = require('./PermissionsForm.jsx');
var DeleteForm = require('./DeleteForm.jsx');
var AdminGroupStore = require('../../stores/AdminGroup');
var Actions = require('../../actions/AdminGroup');


var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {

        AdminGroupStore.resetDetails();
        AdminGroupStore.resetPermissions();
        AdminGroupStore.resetDelete();

        Actions.getDetails(this.props.params);

        return {
            details: AdminGroupStore.getDetails(),
            permissions: AdminGroupStore.getPermissions(),
            delete: AdminGroupStore.getDelete()
        };
    },
    componentDidMount: function () {

        AdminGroupStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        AdminGroupStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            details: AdminGroupStore.getDetails(),
            permissions: AdminGroupStore.getPermissions(),
            delete: AdminGroupStore.getDelete()
        });
    },
    render: function () {

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
});


module.exports = Component;
