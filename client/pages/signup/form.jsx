'use strict';
const Actions = require('./actions');
const Button = require('../../components/form/button');
const ControlGroup = require('../../components/form/control-group');
const React = require('react');
const Spinner = require('../../components/form/spinner');
const Store = require('./store');
const TextControl = require('../../components/form/text-control');


class Component extends React.Component {
    constructor () {

        super();

        this.input = {};
        this.state = Store.getState();
    }

    componentDidMount () {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        this.input.name.focus();
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange () {

        this.setState(Store.getState());
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.sendRequest({
            name: this.input.name.value(),
            username: this.input.username.value(),
            password: this.input.password.value(),
            email: this.input.email.value()
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
                    ref={(ctrl) => { this.input.name = ctrl }}
                    name="name"
                    label="Name"
                    hasError={this.state.hasError.name}
                    help={this.state.help.name}
                    disabled={this.state.loading}
                />
                <TextControl
                    ref={(ctrl) => { this.input.email = ctrl }}
                    name="email"
                    label="Email"
                    hasError={this.state.hasError.email}
                    help={this.state.help.email}
                    disabled={this.state.loading}
                />
                <TextControl
                    ref={(ctrl) => { this.input.username = ctrl }}
                    name="username"
                    label="Username"
                    hasError={this.state.hasError.username}
                    help={this.state.help.username}
                    disabled={this.state.loading}
                />
                <TextControl
                    ref={(ctrl) => { this.input.password = ctrl }}
                    name="password"
                    label="Password"
                    type="password"
                    hasError={this.state.hasError.password}
                    help={this.state.help.password}
                    disabled={this.state.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.state.loading}>

                        Create my account
                        <Spinner space="left" show={this.state.loading} />
                    </Button>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <section>
                <h1 className="page-header">Sign up</h1>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
}


module.exports = Component;
