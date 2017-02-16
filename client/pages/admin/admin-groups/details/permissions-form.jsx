'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const Button = require('../../../../components/form/button.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state');
const React = require('react');
const Spinner = require('../../../../components/form/spinner.jsx');
const NodeUUId = require('node-uuid');


const propTypes = {
    error: React.PropTypes.string,
    loading: React.PropTypes.bool,
    showSaveSuccess: React.PropTypes.bool,
    options: React.PropTypes.array,
    adminGroupId: React.PropTypes.string,
    permissionEntries: React.PropTypes.array
};


class PermissionsForm extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
        this.state = {
            permissionEntries: props.permissionEntries,
            newPermission: ''
        };
    }

    handleNewPermission() {

        const selectedPermission = this.els.newPermission.options[this.els.newPermission.selectedIndex];

        if (!selectedPermission.value) {
            return;
        }

        const value = selectedPermission.value;
        const updatedPermissionEntries = this.state.permissionEntries;
        const permission = this.props.options.find((p) => {

            if (p.id === value ){
                return true;
            }
        });
        const permissionEntry = {
            id : NodeUUId.v1(),
            admin_group_id : this.props.adminGroupId,
            active: true,
            permission_id : permission.id,
            Permission: permission
        };
        updatedPermissionEntries.push(permissionEntry);

        this.setState({
            permissionEntries: updatedPermissionEntries,
            newPermission: ''
        });
    }

    onEnterNewPermission(event) {

        if (event.which === 13) {
            event.preventDefault();
            event.stopPropagation();

            this.handleNewPermission();
        }
    }

    handleTogglePermission(id) {

        const updatedPermissionEntries = this.state.permissionEntries;

        const permissionEntry = updatedPermissionEntries.find( (pe) => {

            if ( pe.id === id ){
                return true;
            }
        });

        permissionEntry.active = !permissionEntry.active;

        this.setState({
            permissionEntries: updatedPermissionEntries
        });
    }

    handleDeletePermission(id) {

        const updatedPermissionEntries = this.state.permissionEntries;

        for ( let i = updatedPermissionEntries.length - 1; i >= 0; --i){
            if ( updatedPermissionEntries[i].id === id){
                updatedPermissionEntries.splice(i,1);
                break;
            }
        };

        this.setState({
            permissionEntries: updatedPermissionEntries
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        const id = this.props.adminGroupId;
        const data = {
            permissionEntries: this.state.permissionEntries
        };

        Actions.savePermissions(id, data);
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hidePermissionsSaveSuccess}
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

        const permissionEntries = this.state.permissionEntries;
        permissionEntries.sort((a, b) => {

            return a.Permission.name.toLowerCase().localeCompare(b.Permission.name.toLowerCase());
        });
        let permissionsUi = permissionEntries.map((permissionEntry) => {

            const deleteHandler = this.handleDeletePermission.bind(this, permissionEntry.id);
            const toggleHandler = this.handleTogglePermission.bind(this, permissionEntry.id);
            let toggleIcon;

            if (permissionEntry.active) {
                toggleIcon = <i className="fa fa-toggle-on"></i>;
            }
            else {
                toggleIcon = <i className="fa fa-toggle-off"></i>;
            }
            const id = permissionEntry.id;
            return (
                <div key={id} className="input-group">
                    <input
                        type="text"
                        name="newPermission"
                        className="form-control"
                        disabled={true}
                        value={permissionEntry.Permission.name}
                    />
                    <span className="input-group-btn">
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={toggleHandler}>

                            {toggleIcon}
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={deleteHandler}>

                            Remove
                        </button>
                    </span>
                </div>
            );
        });

        if (permissionEntries.length === 0) {
            permissionsUi = <div>
                <span className="label label-default">none</span>
            </div>;
        }

        const currentPermissionEntryIds = permissionEntries.map((permissionEntry) => {

            return permissionEntry.Permission.id;
        });
        const permissionOptions = this.props.options.map((permission) => {

            return (
                <option
                    key={permission.id}
                    value={permission.id}
                    disabled ={currentPermissionEntryIds.includes(permission.id)}>
                    {permission.name}
                </option>
            );
        });

        const formElements = <fieldset>
            <legend>Permissions</legend>
            {alerts}
            <ControlGroup label="Add permission" hideHelp={true}>
                <div className="input-group">
                    <select
                        ref={(c) => (this.els.newPermission = c)}
                        name ="newPermission"
                        className="form-control"
                        value={this.state.newPermission}
                        onChange={LinkState.bind(this)}
                        disabled={this.props.loading}>

                        <option value="">--- select ---</option>
                        {permissionOptions}
                    </select>
                    <span className="input-group-btn">
                        <button
                            ref={(c) => (this.els.newPermissionButton = c)}
                            type="button"
                            className="btn btn-default"
                            onClick={this.handleNewPermission.bind(this)}
                            disabled={this.props.loading}>

                            Add
                        </button>
                    </span>
                </div>
            </ControlGroup>
            <ControlGroup label="Existing permissions" hideHelp={true}>
                {permissionsUi}
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

PermissionsForm.propTypes = propTypes;


module.exports = PermissionsForm;
