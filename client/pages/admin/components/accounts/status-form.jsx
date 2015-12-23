'use strict';
const React = require('react');
const ControlGroup = require('../../../../components/form/control-group');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions/account');


class Component extends React.Component {
    getInitialState () {

        return {};
    }

    componentWillReceiveProps (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.details.hydrated,
                newStatus: nextProps.details.status.current.id
            });
        }
    }

    componentWillUnmount () {

        clearTimeout(this.timeout);
    }

    handleSubmit (event) {

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
    }

    render () {

        const alerts = [];
        const error = this.props.data.error || this.state.error;

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

        let notice;

        if (!this.props.details.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        let formElements;

        if (this.props.details.hydrated) {
            const statuses = this.props.list.data;
            const statusOptions = statuses.map(function (status) {

                return (
                    <option key={status._id} value={status._id}>
                        {status.name}
                    </option>
                );
            });

            const statusData = this.props.details.status;
            const history = statusData.log || [];
            const statusHistory = history.map(function (status) {

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
}


module.exports = Component;
