var React = require('react/addons');
var ReactRouter = require('react-router');
var DetailsForm = require('./DetailsForm');
var PermissionsForm = require('./PermissionsForm');
var DeleteForm = require('./DeleteForm');
var AdminGroupStore = require('../../stores/AdminGroup');
var Actions = require('../../actions/AdminGroup');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedState],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {

        AdminGroupStore.resetDetails();
        AdminGroupStore.resetPermissions();
        AdminGroupStore.resetDelete();

        Actions.getDetails(this.context.router.getCurrentParams());

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
                        <Link to="adminGroups">Admin Groups</Link> / Error
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
                    <Link to="adminGroups">Admin Groups</Link> / {this.state.details.name}
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
