var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../components/form/ControlGroup.jsx');
var TextControl = require('../../../components/form/TextControl.jsx');
var Button = require('../../../components/form/Button.jsx');
var Spinner = require('../../../components/form/Spinner.jsx');
var Actions = require('../Actions');
var LoginStore = require('../stores/Login');


var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {

        LoginStore.reset();
        return LoginStore.getState();
    },
    componentDidMount: function () {

        LoginStore.addChangeListener(this.onStoreChange);
        this.refs.username.refs.inputField.focus();
    },
    componentWillUnmount: function () {

        LoginStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState(LoginStore.getState());
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.login({
            username: this.state.username,
            password: this.state.password
        });
    },
    render: function () {

        var alerts = [];
        if (this.state.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. Redirecting...
            </div>);
        }
        else if (this.state.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.state.error}
            </div>);
        }

        var formElements;
        if (!this.state.success) {
            formElements = <fieldset>
                <TextControl
                    name="username"
                    label="Username or email"
                    ref="username"
                    hasError={this.state.hasError.username}
                    valueLink={this.linkState('username')}
                    help={this.state.help.username}
                    disabled={this.state.loading}
                />
                <TextControl
                    name="password"
                    label="Password"
                    type="password"
                    hasError={this.state.hasError.password}
                    valueLink={this.linkState('password')}
                    help={this.state.help.password}
                    disabled={this.state.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.state.loading}>

                        Sign in
                        <Spinner space="left" show={this.state.loading} />
                    </Button>
                    <Link to="/login/forgot" className="btn btn-link">Forgot your password?</Link>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <section>
                <h1 className="page-header">Sign in</h1>
                <form onSubmit={this.handleSubmit}>
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
});


module.exports = Component;
