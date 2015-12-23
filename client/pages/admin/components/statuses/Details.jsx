var React = require('react');
var ReactRouter = require('react-router');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var DetailsForm = require('./DetailsForm.jsx');
var DeleteForm = require('./DeleteForm.jsx');
var StatusStore = require('../../stores/Status');
var Actions = require('../../actions/Status');


var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {

        StatusStore.resetDetails();
        StatusStore.resetDelete();

        Actions.getDetails(this.props.params);

        return {
            details: StatusStore.getDetails(),
            delete: StatusStore.getDelete()
        };
    },
    componentDidMount: function () {

        StatusStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        StatusStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            details: StatusStore.getDetails(),
            delete: StatusStore.getDelete()
        });
    },
    render: function () {

        if (this.state.details.hydrated && this.state.details.fetchFailure) {
            return (
                <section className="section-status-details container">
                    <h1 className="page-header">
                        <Link to="/admin/statuses">Statuses</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.details.error}
                    </div>
                </section>
            );
        }

        return (
            <section className="section-status-details container">
                <h1 className="page-header">
                    <Link to="/admin/statuses">Statuses</Link> / {this.state.details.name}
                </h1>
                <div className="row">
                    <div className="col-sm-6">
                        <DetailsForm data={this.state.details} />
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
