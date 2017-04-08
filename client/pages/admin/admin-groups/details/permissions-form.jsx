'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const Button = require('../../../../components/form/button.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../../components/form/spinner.jsx');


const propTypes = {
    adminGroupId: PropTypes.string,
    error: PropTypes.string,
    loading: PropTypes.bool,
    permissions: PropTypes.object,
    showSaveSuccess: PropTypes.bool
};


class PermissionsForm extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
        this.state = {
            permissions: props.permissions,
            newPermission: ''
        };
    }

    handleNewPermission() {

        const newPermission = this.els.newPermission.value.trim();

        if (!newPermission) {
            return;
        }

        const updatedPermissions = this.state.permissions;

        updatedPermissions[newPermission] = true;

        this.setState({
            permissions: updatedPermissions,
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

    handleTogglePermission(key) {

        const updatedPermissions = this.state.permissions;

        updatedPermissions[key] = !updatedPermissions[key];

        this.setState({
            permissions: updatedPermissions
        });
    }

    handleDeletePermission(key) {

        const updatedPermissions = this.state.permissions;

        delete updatedPermissions[key];

        this.setState({
            permissions: updatedPermissions
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        const id = this.props.adminGroupId;
        const data = {
            permissions: this.state.permissions
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

        const permissions = this.state.permissions;
        const permissionKeys = Object.keys(permissions).sort((a, b) => {

            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        let permissionsUi = permissionKeys.map((key) => {

            const deleteHandler = this.handleDeletePermission.bind(this, key);
            const toggleHandler = this.handleTogglePermission.bind(this, key);
            let toggleIcon;

            if (permissions[key]) {
                toggleIcon = <i className="fa fa-toggle-on"></i>;
            }
            else {
                toggleIcon = <i className="fa fa-toggle-off"></i>;
            }

            return (
                <div key={key} className="input-group">
                    <input
                        type="text"
                        name="newPermission"
                        className="form-control"
                        disabled={true}
                        value={key}
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

        if (permissionKeys.length === 0) {
            permissionsUi = <div>
                <span className="label label-default">none</span>
            </div>;
        }

        const formElements = <fieldset>
            <legend>Permissions</legend>
            {alerts}
            <ControlGroup label="Add permission" hideHelp={true}>
                <div className="input-group">
                    <input
                        ref={(c) => (this.els.newPermission = c)}
                        type="text"
                        name="newPermission"
                        className="form-control"
                        placeholder=""
                        onKeyDown={this.onEnterNewPermission.bind(this)}
                        value={this.state.newPermission}
                        onChange={LinkState.bind(this)}
                    />
                    <span className="input-group-btn">
                        <button
                            ref={(c) => (this.els.newPermissionButton = c)}
                            type="button"
                            className="btn btn-default"
                            onClick={this.handleNewPermission.bind(this)}>

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
