var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var TextControl = require('../../../../components/form/TextControl');
var Button = require('../../../../components/form/Button');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/User');


var Component = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {

        return {};
    },
    componentWillReceiveProps: function (nextProps) {

        if (!this.props.identity.hydrated) {
            this.replaceState({});
        }
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.savePassword({
            id: this.props.identity._id,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        });
    },
    render: function () {

        var alerts = [];
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
                            <Spinner space="left" show={this.props.data.loading} />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
});


module.exports = Component;
