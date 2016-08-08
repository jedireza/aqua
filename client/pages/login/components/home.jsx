'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ControlGroup = require('../../../components/form/control-group');
const TextControl = require('../../../components/form/text-control');
const Button = require('../../../components/form/button');
const Spinner = require('../../../components/form/spinner');
const Actions = require('../actions');
const LoginStore = require('../stores/login');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        LoginStore.reset();
        return LoginStore.getState();
    }

    componentDidMount () {

        LoginStore.addChangeListener(this.onStoreChange);
        this.refs.username.refs.inputField.focus();
    }

    componentWillUnmount () {

        LoginStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState(LoginStore.getState());
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.login({
            username: this.state.username,
            password: this.state.password
        });
    }

    render () {

        const alerts = [];

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

        let formElements;

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
}


module.exports = Component;
