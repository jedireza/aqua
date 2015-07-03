var React = require('react/addons');
var Modal = require('../../../../components/Modal');
var ControlGroup = require('../../../../components/form/ControlGroup');
var TextControl = require('../../../../components/form/TextControl');
var Button = require('../../../../components/form/Button');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/User');


var LinkedState = React.addons.LinkedStateMixin;


var Component = React.createClass({
    mixins: [LinkedState],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {

        return {};
    },
    componentWillUnmount: function () {

        clearTimeout(this.timeout);
    },
    componentWillReceiveProps: function (nextProps) {

        if (!nextProps.data.show) {
            this.replaceState({});
        }
        else {
            this.timeout = setTimeout(function () {

                this.refs.username.refs.inputField.getDOMNode().focus();
            }.bind(this), 100);
        }
    },
    onSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.createNew({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }, this.context.router);
    },
    render: function () {

        var alerts;
        if (this.props.data.error) {
            alerts = <div className="alert alert-danger">
                {this.props.data.error}
            </div>;
        }

        var notice;
        if (this.props.data.success) {
            notice = <div className="alert alert-success">
                Loading data...
            </div>;
        }

        var formElements;
        if (!this.props.data.success) {
            formElements = <fieldset>
                {alerts}
                <TextControl
                    name="username"
                    ref="username"
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
                <TextControl
                    name="password"
                    label="Password"
                    type="password"
                    hasError={this.props.data.hasError.password}
                    valueLink={this.linkState('password')}
                    help={this.props.data.help.password}
                    disabled={this.props.data.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.props.data.loading}>

                        Create new
                        <Spinner space="left" show={this.props.data.loading} />
                    </Button>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <Modal
                header="Create new"
                show={this.props.data.show}
                onClose={Actions.hideCreateNew}>

                <form onSubmit={this.onSubmit}>
                    {notice}
                    {formElements}
                </form>
            </Modal>
        );
    }
});


module.exports = Component;
