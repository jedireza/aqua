'use strict';
const Actions = require('./actions');
const Alert = require('../../../components/alert.jsx');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const TextControl = require('../../../components/form/text-control.jsx');


const propTypes = {
    email: PropTypes.string,
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    hydrated: PropTypes.bool,
    loading: PropTypes.bool,
    showSaveSuccess: PropTypes.bool,
    username: PropTypes.string
};


class UserForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            username: props.username,
            email: props.email
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            username: nextProps.username,
            email: nextProps.email
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveUser({
            username: this.state.username,
            email: this.state.email
        });
    }

    render() {

        if (!this.props.hydrated) {
            return (
                <div className="alert alert-info">
                    Loading identity data...
                </div>
            );
        }

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

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <fieldset>
                    <legend>Identity</legend>
                    {alerts}
                    <TextControl
                        name="username"
                        label="Username"
                        value={this.state.username}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError.username}
                        help={this.props.help.username}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="email"
                        label="Email"
                        value={this.state.email}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError.email}
                        help={this.props.help.email}
                        disabled={this.props.loading}
                    />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.loading}>

                            Update identity
                            <Spinner
                                space="left"
                                show={this.props.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
}

UserForm.propTypes = propTypes;


module.exports = UserForm;
