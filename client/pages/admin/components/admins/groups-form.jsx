'use strict';
const React = require('react');
const ControlGroup = require('../../../../components/form/control-group');
const Button = require('../../../../components/form/button');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions/admin');


class Component extends React.Component {
    getInitialState () {

        return {};
    }

    componentWillReceiveProps (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.details.hydrated,
                groups: nextProps.details.groups
            });
        }
    }

    handleNewGroup (event) {

        const newGroup = this.state.newGroup;

        if (!newGroup) {
            return;
        }

        let newGroupValue;

        this.props.list.data.forEach(function (group) {

            if (group._id === newGroup) {
                newGroupValue = group.name;
            }
        });

        const nextGroups = this.state.groups || {};

        if (nextGroups.hasOwnProperty(newGroup)) {
            this.setState({ error: 'That group already exists.' });
            setTimeout(function () {

                this.setState({ error: undefined });
            }.bind(this), 2500);
        }
        else {
            nextGroups[newGroup] = newGroupValue;
            this.setState({ groups: nextGroups });
        }

        this.setState({ newGroup: '' });
    }

    handleDeleteGroup (key, event) {

        const nextGroups = this.state.groups;

        delete nextGroups[key];
        this.setState({ groups: nextGroups });
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveGroups({
            id: this.props.details._id,
            groups: this.state.groups
        });
    }

    render () {

        const alerts = [];
        let error = this.props.data.error || this.state.error;

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
            const groups = this.state.groups || {};
            const groupKeys = Object.keys(groups).sort(function (a, b) {

                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            let groupsUi = groupKeys.map(function (key) {

                const deleteHandler = this.handleDeleteGroup.bind(this, key);

                return (
                    <div
                        key={key}
                        className="input-group">

                        <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            value={groups[key]}
                        />
                        <span className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={deleteHandler}>

                                Remove
                            </button>
                        </span>
                    </div>
                );
            }.bind(this));

            if (groupKeys.length === 0) {
                groupsUi = <div>
                    <span className="label label-default">
                        empty list
                    </span>
                </div>;
            }

            const adminGroups = this.props.list.data;
            const groupOptions = adminGroups.map(function (group) {

                return (
                    <option key={group._id} value={group._id}>
                        {group.name}
                    </option>
                );
            });

            formElements = <fieldset>
                <legend>Groups</legend>
                {alerts}
                <ControlGroup label="Add group" hideHelp={true}>
                    <div className="input-group">
                        <select
                            ref="newGroup"
                            name="newGroup"
                            className="form-control"
                            valueLink={this.linkState('newGroup')}>

                            <option value="">--- select ---</option>
                            {groupOptions}
                        </select>
                        <span className="input-group-btn">
                            <button
                                ref="newGroupButton"
                                type="button"
                                className="btn btn-default"
                                onClick={this.handleNewGroup}>

                                Add
                            </button>
                        </span>
                    </div>
                </ControlGroup>
                <ControlGroup
                    ref="groupContainer"
                    label="Existing groups"
                    hideHelp={true}>

                    {groupsUi}
                </ControlGroup>
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.props.data.loading}>

                        Save changes
                        <Spinner space="left" show={this.props.data.loading} />
                    </Button>
                </ControlGroup>
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
