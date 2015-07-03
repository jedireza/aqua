var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var Button = require('../../../../components/form/Button');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/Admin');


var Component = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {

        return {};
    },
    componentWillReceiveProps: function (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.details.hydrated,
                permissions: nextProps.details.permissions
            });
        }
    },
    handleNewPermission: function (event) {

        var newPermission = this.refs.newPermission.getDOMNode().value.trim();

        if (!newPermission) {
            return;
        }

        var nextPermissions = this.state.permissions || {};
        if (nextPermissions.hasOwnProperty(newPermission)) {
            this.setState({ error: 'That permission already exists.' });
            setTimeout(function () {

                this.setState({ error: undefined });
            }.bind(this), 2500);
        }
        else {
            nextPermissions[newPermission] = true;
            this.setState({ permissions: nextPermissions });
        }

        this.setState({ newPermission: '' });
    },
    onEnterNewPermission: function (event) {

        if (event.which === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.handleNewPermission(event);
        }
    },
    handleTogglePermission: function (key, event) {

        var nextPermissions = this.state.permissions;
        nextPermissions[key] = !nextPermissions[key];
        this.setState({ permissions: nextPermissions });
    },
    handleDeletePermission: function (key, event) {

        var nextPermissions = this.state.permissions;
        delete nextPermissions[key];
        this.setState({ permissions: nextPermissions });
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.savePermissions({
            id: this.props.details._id,
            permissions: this.state.permissions
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
            var permissions = this.state.permissions || {};
            var permissionKeys = Object.keys(permissions).sort(function (a, b) {

                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            var permissionsUi = permissionKeys.map(function (key) {

                var deleteHandler = this.handleDeletePermission.bind(this, key);
                var toggleHandler = this.handleTogglePermission.bind(this, key);
                var toggleIcon;
                if (permissions[key]) {
                    toggleIcon = <i className="fa fa-toggle-on"></i>;
                }
                else {
                    toggleIcon = <i className="fa fa-toggle-off"></i>;
                }

                return (
                    <div
                        key={key}
                        className="input-group">

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
            }.bind(this));

            if (permissionKeys.length === 0) {
                permissionsUi = <div>
                    <span className="label label-default">
                        empty list
                    </span>
                </div>;
            }

            formElements = <fieldset>
                <legend>Permissions</legend>
                {alerts}
                <ControlGroup label="Add permission" hideHelp={true}>
                    <div className="input-group">
                        <input
                            ref="newPermission"
                            type="text"
                            name="newPermission"
                            className="form-control"
                            placeholder=""
                            onKeyDown={this.onEnterNewPermission}
                            valueLink={this.linkState('newPermission')}
                        />
                        <span className="input-group-btn">
                            <button
                                ref="newPermissionButton"
                                type="button"
                                className="btn btn-default"
                                onClick={this.handleNewPermission}>

                                Add
                            </button>
                        </span>
                    </div>
                </ControlGroup>
                <ControlGroup
                    ref="permissionContainer"
                    label="Existing permissions"
                    hideHelp={true}>

                    {permissionsUi}
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
});


module.exports = Component;
