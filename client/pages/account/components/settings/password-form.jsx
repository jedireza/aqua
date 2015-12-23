'use strict';
const React = require('react');
const ControlGroup = require('../../../../components/form/control-group');
const TextControl = require('../../../../components/form/text-control');
const Button = require('../../../../components/form/button');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions');


class Component extends React.Component {
    getInitialState () {

        return {};
    }

    componentWillReceiveProps (nextProps) {

        if (nextProps.data.success) {
            this.replaceState({});
        }
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.savePasswordSettings({
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        });
    }

    render () {

        const alerts = [];

        if (this.props.data.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. New password set.
            </div>);
        }
        else if (this.props.data.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.props.data.error}
            </div>);
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>Password</legend>
                    {alerts}
                    <TextControl
                        name="password"
                        label="New password"
                        type="password"
                        hasError={this.props.data.hasError.password}
                        valueLink={this.linkState('password')}
                        help={this.props.data.help.password}
                        disabled={this.props.data.loading}
                    />
                    <TextControl
                        name="passwordConfirm"
                        label="Confirm new password"
                        type="password"
                        hasError={this.props.data.hasError.passwordConfirm}
                        valueLink={this.linkState('passwordConfirm')}
                        help={this.props.data.help.passwordConfirm}
                        disabled={this.props.data.loading}
                    />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.data.loading}>

                            Set password
                            <Spinner
                                space="left"
                                show={this.props.data.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
}


module.exports = Component;
