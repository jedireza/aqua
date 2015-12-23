'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const Button = require('../../../../components/form/button.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state');
const React = require('react');
const Spinner = require('../../../../components/form/spinner.jsx');


const propTypes = {
    error: React.PropTypes.string,
    loading: React.PropTypes.bool,
    showSaveSuccess: React.PropTypes.bool,
    options: React.PropTypes.array,
    adminId: React.PropTypes.string,
    groups: React.PropTypes.object
};


class GroupsForm extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
        this.state = {
            groups: props.groups,
            newGroup: ''
        };
    }

    handleNewGroup() {

        const selectedOption = this.els.newGroup.options[this.els.newGroup.selectedIndex];

        if (!selectedOption.value) {
            return;
        }

        const label = selectedOption.innerText;
        const value = selectedOption.value;
        const updatedGroups = this.state.groups;

        updatedGroups[value] = label;

        this.setState({
            groups: updatedGroups,
            newGroup: ''
        });
    }

    handleDeleteGroup(key) {

        const updatedGroups = this.state.groups;

        delete updatedGroups[key];

        this.setState({
            groups: updatedGroups,
            newGroup: ''
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        const id = this.props.adminId;
        const data = {
            groups: this.state.groups
        };

        Actions.saveGroups(id, data);
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideGroupsSaveSuccess}
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

        const groups = this.state.groups;
        const groupKeys = Object.keys(groups).sort((a, b) => {

            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        let groupsUi = groupKeys.map((key) => {

            const deleteHandler = this.handleDeleteGroup.bind(this, key);

            return (
                <div
                    key={key}
                    className="input-group">

                    <input
                        type="text"
                        className="form-control"
                        disabled={true}
                        value={this.state.groups[key]}
                    />
                    <span className="input-group-btn">
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={deleteHandler}
                            disabled={this.props.loading}>

                            Remove
                        </button>
                    </span>
                </div>
            );
        });

        if (groupKeys.length === 0) {
            groupsUi = <div>
                <span className="label label-default">none</span>
            </div>;
        }

        const currentGroupIds = Object.keys(groups);
        const groupOptions = this.props.options.map((group) => {

            return (
                <option
                    key={group._id}
                    value={group._id}
                    disabled={currentGroupIds.includes(group._id)}>

                    {group.name}
                </option>
            );
        });

        const formElements = <fieldset>
            <legend>Groups</legend>
            {alerts}
            <ControlGroup label="Add group" hideHelp={true}>
                <div className="input-group">
                    <select
                        ref={(c) => (this.els.newGroup = c)}
                        name="newGroup"
                        className="form-control"
                        value={this.state.newGroup}
                        onChange={LinkState.bind(this)}
                        disabled={this.props.loading}>

                        <option value="">--- select ---</option>
                        {groupOptions}
                    </select>
                    <span className="input-group-btn">
                        <button
                            ref={(c) => (this.els.newGroupButton = c)}
                            type="button"
                            className="btn btn-default"
                            onClick={this.handleNewGroup.bind(this)}
                            disabled={this.props.loading}>

                            Add
                        </button>
                    </span>
                </div>
            </ControlGroup>
            <ControlGroup label="Existing groups" hideHelp={true}>
                {groupsUi}
            </ControlGroup>
            <ControlGroup hideLabel={true} hideHelp={true}>
                <Button
                    type="submit"
                    inputClasses={{ 'btn-primary': true }}
                    disabled={this.props.loading}>

                    Save changes
                    <Spinner space="left" show={this.props.loading} />
                </Button>
            </ControlGroup>
        </fieldset>;

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                {formElements}
            </form>
        );
    }
}

GroupsForm.propTypes = propTypes;


module.exports = GroupsForm;
