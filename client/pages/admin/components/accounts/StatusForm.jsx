var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/Account');


var Component = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {

        return {};
    },
    componentWillReceiveProps: function (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.details.hydrated,
                newStatus: nextProps.details.status.current.id
            });
        }
    },
    componentWillUnmount: function () {

        clearTimeout(this.timeout);
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.state.newStatus === this.props.details.status.current.id) {
            this.setState({
                error: 'That is the current status.'
            });

            this.timeout = setTimeout(function () {

                this.setState({ error: undefined });
            }.bind(this), 2500);

            return;
        }

        Actions.newStatus({
            id: this.props.details._id,
            status: this.state.newStatus
        });
    },
    render: function () {

        var alerts = [];
        var error = this.props.data.error || this.state.error;
        if (this.props.data.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. Changes have been saved.
            </div>);
        }
        else if (error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {error}
            </div>);
        }

        var notice;
        if (!this.props.details.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        var formElements;
        if (this.props.details.hydrated) {
            var statuses = this.props.list.data;
            var statusOptions = statuses.map(function (status) {

                return (
                    <option key={status._id} value={status._id}>
                        {status.name}
                    </option>
                );
            });

            var statusData = this.props.details.status;
            var history = statusData.log || [];
            var statusHistory = history.map(function (status) {

                return (
                    <li key={status.timeCreated} className="list-group-item">
                        <span
                            title={status.moment.toString()}
                            className="badge pull-right">

                            {status.userCreated.name} - {status.moment.fromNow()}
                        </span>
                        {status.name}
                    </li>
                );
            });

            formElements = <fieldset>
                <legend>Status</legend>
                {alerts}
                <ControlGroup
                    hideLabel={true}
                    hasError={this.props.data.hasError.status}
                    help={this.props.data.help.status}>

                    <div className="input-group">
                        <select
                            ref="newStatus"
                            name="newStatus"
                            className="form-control"
                            valueLink={this.linkState('newStatus')}>

                            <option value="">--- select ---</option>
                            {statusOptions}
                        </select>
                        <span className="input-group-btn">
                            <button
                                ref="newStatusButton"
                                type="submit"
                                className="btn btn-default">

                                Change
                                <Spinner
                                    space="left"
                                    show={this.props.data.loading}
                                />
                            </button>
                        </span>
                    </div>
                </ControlGroup>
                <ul className="list-group list-group-statuses">
                    {statusHistory}
                </ul>
            </fieldset>;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                {notice}
                {formElements}
            </form>
        );
    }
});


module.exports = Component;
