'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state');
const Moment = require('moment');
const React = require('react');
const Spinner = require('../../../../components/form/spinner.jsx');


const propTypes = {
    accountId: React.PropTypes.string,
    current: React.PropTypes.object,
    error: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    loading: React.PropTypes.bool,
    log: React.PropTypes.array,
    newStatus: React.PropTypes.string,
    options: React.PropTypes.array,
    showSaveSuccess: React.PropTypes.bool
};


class StatusForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            newStatus: props.newStatus
        };
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        const id = this.props.accountId;
        const data = {
            current: this.props.current,
            status: this.state.newStatus
        };

        Actions.newStatus(id, data);
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideStatusSaveSuccess}
                message="Success. Changes have been saved."
            />);
        }

        if (this.props.error) {
            alerts.push(<Alert
                key="danger"
                type="danger"
                message={this.props.error}
            />);
        }

        const statusOptions = this.props.options.map((status) => {

            return (
                <option key={status._id} value={status._id}>
                    {status.name}
                </option>
            );
        });

        const statusHistory = this.props.log.map((status) => {

            const moment = Moment(status.timeCreated);

            return (
                <li key={status.timeCreated} className="list-group-item">
                    <span
                        title={moment.toString()}
                        className="badge pull-right">

                        {status.userCreated.name} - {moment.fromNow()}
                    </span>
                    {status.name}
                </li>
            );
        });

        const formElements = <fieldset>
            <legend>Status</legend>
            {alerts}
            <ControlGroup
                hideLabel={true}
                hasError={this.props.hasError.status}
                help={this.props.help.status}>

                <div className="input-group">
                    <select
                        name="newStatus"
                        className="form-control"
                        value={this.state.newStatus}
                        onChange={LinkState.bind(this)}>

                        <option value="">--- select ---</option>
                        {statusOptions}
                    </select>
                    <span className="input-group-btn">
                        <button
                            type="submit"
                            className="btn btn-default"
                            disabled={this.props.loading}>

                            Change
                            <Spinner
                                space="left"
                                show={this.props.loading}
                            />
                        </button>
                    </span>
                </div>
            </ControlGroup>
            <ul className="list-group list-group-statuses">
                {statusHistory}
            </ul>
        </fieldset>;

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                {formElements}
            </form>
        );
    }
}

StatusForm.propTypes = propTypes;


module.exports = StatusForm;
