var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ControlGroup = require('../../../../components/form/ControlGroup.jsx');
var TextControl = require('../../../../components/form/TextControl.jsx');
var Button = require('../../../../components/form/Button.jsx');
var Spinner = require('../../../../components/form/Spinner.jsx');
var Actions = require('../../Actions');


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {

        return {};
    },
    componentWillReceiveProps: function (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.data.hydrated,
                username: nextProps.data.username,
                email: nextProps.data.email
            });
        }
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveUserSettings({
            username: this.state.username,
            email: this.state.email
        });
    },
    render: function () {

        var alerts = [];
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

        var notice;
        if (!this.props.data.hydrated) {
            notice = <div className="alert alert-info">
                Loading identity data...
            </div>;
        }

        var formElements;
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
});


module.exports = Component;
