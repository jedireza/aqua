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
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    loading: PropTypes.bool,
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
    showSaveSuccess: PropTypes.bool
};


class PasswordForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            password: props.password,
            passwordConfirm: props.passwordConfirm
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            password: nextProps.password,
            passwordConfirm: nextProps.passwordConfirm
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.savePassword({
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        });
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hidePasswordSaveSuccess}
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
                    <legend>Password</legend>
                    {alerts}
                    <TextControl
                        name="password"
                        type="password"
                        label="New password"
                        value={this.state.password}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError.password}
                        help={this.props.help.password}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="passwordConfirm"
                        type="password"
                        label="Confirm new password"
                        value={this.state.passwordConfirm}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError.passwordConfirm}
                        help={this.props.help.passwordConfirm}
                        disabled={this.props.loading}
                    />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.loading}>

                            Set password
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

PasswordForm.propTypes = propTypes;


module.exports = PasswordForm;
