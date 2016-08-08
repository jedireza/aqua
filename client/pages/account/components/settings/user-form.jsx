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

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.data.hydrated,
                username: nextProps.data.username,
                email: nextProps.data.email
            });
        }
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveUserSettings({
            username: this.state.username,
            email: this.state.email
        });
    }

    render () {

        const alerts = [];

        if (this.props.data.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. Identity settings saved.
            </div>);
        }
        else if (this.props.data.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.props.data.error}
            </div>);
        }

        let notice;

        if (!this.props.data.hydrated) {
            notice = <div className="alert alert-info">
                Loading identity data...
            </div>;
        }

        let formElements;

        if (this.props.data.hydrated) {
            formElements = (
                <fieldset>
                    <legend>Identity</legend>
                    {alerts}
                    <TextControl
                        name="username"
                        label="Username"
                        hasError={this.props.data.hasError.username}
                        valueLink={this.linkState('username')}
                        help={this.props.data.help.username}
                        disabled={this.props.data.loading}
                    />
                    <TextControl
                        name="email"
                        label="Email"
                        hasError={this.props.data.hasError.email}
                        valueLink={this.linkState('email')}
                        help={this.props.data.help.email}
                        disabled={this.props.data.loading}
                    />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.data.loading}>

                            Update identity
                            <Spinner
                                space="left"
                                show={this.props.data.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            );
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
