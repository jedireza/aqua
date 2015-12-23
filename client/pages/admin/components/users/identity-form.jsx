'use strict';
const React = require('react');
const ControlGroup = require('../../../../components/form/control-group');
const TextControl = require('../../../../components/form/text-control');
const SelectControl = require('../../../../components/form/select-control');
const Button = require('../../../../components/form/button');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions/user');


class Component extends React.Component {
    getInitialState () {

        return {};
    }

    componentWillReceiveProps (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.data.hydrated,
                isActive: nextProps.data.isActive,
                username: nextProps.data.username,
                email: nextProps.data.email
            });
        }
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveIdentity({
            id: this.props.data._id,
            isActive: this.state.isActive,
            username: this.state.username,
            email: this.state.email
        });
    }

    render () {

        const alerts = [];

        if (this.props.data.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. Changes have been saved.
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
                Loading data...
            </div>;
        }

        let formElements;

        if (this.props.data.hydrated) {
            formElements = <fieldset>
                <legend>Identity</legend>
                {alerts}
                <SelectControl
                    name="isActive"
                    label="Active"
                    disabled={this.props.data.loading}
                    valueLink={this.linkState('isActive')}>

                    <option value={true}>true</option>
                    <option value={false}>false</option>
                </SelectControl>
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
