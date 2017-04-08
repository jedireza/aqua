/* global window */
'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const Button = require('../../../../components/form/button.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state');
const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');
const Spinner = require('../../../../components/form/spinner.jsx');
const TextControl = require('../../../../components/form/text-control.jsx');


const Link = ReactRouter.Link;
const propTypes = {
    adminId: PropTypes.string,
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    id: PropTypes.string,
    loading: PropTypes.bool,
    name: PropTypes.string,
    showSaveSuccess: PropTypes.bool
};


class UserForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            username: ''
        };
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.props.id) {
            if (!window.confirm('Are you sure?')) {
                return;
            }

            Actions.unlinkUser(this.props.adminId);

            this.setState({ username: '' });
        }
        else {
            const id = this.props.adminId;
            const data = {
                username: this.state.username
            };

            Actions.linkUser(id, data);
        }
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideUserSaveSuccess}
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

        let button;
        let username;

        if (this.props.id) {
            username = <ControlGroup label="Username">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        disabled={true}
                        value={this.props.name}
                    />
                    <span className="input-group-btn">
                        <Link
                            to={`/admin/users/${this.props.id}`}
                            className="btn btn-default">

                            View
                        </Link>
                    </span>
                </div>
            </ControlGroup>;

            button = <Button
                type="submit"
                inputClasses={{ 'btn-danger': true }}
                disabled={this.props.loading}>

                Unlink user
                <Spinner space="left" show={this.props.loading} />
            </Button>;
        }
        else {
            username = <TextControl
                name="username"
                label="Username"
                value={this.state.username}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError.username}
                help={this.props.help.username}
                disabled={this.props.loading}
            />;

            button = <Button
                type="submit"
                inputClasses={{ 'btn-primary': true }}
                disabled={this.props.loading}>

                Link user
                <Spinner space="left" show={this.props.loading} />
            </Button>;
        }

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <fieldset>
                    <legend>User</legend>
                    {alerts}
                    {username}
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        {button}
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
}

UserForm.propTypes = propTypes;


module.exports = UserForm;
