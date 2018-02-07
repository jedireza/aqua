'use strict';
const Actions = require('./actions');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const Store = require('./store');
const TextControl = require('../../../components/form/text-control.jsx');


class Form extends React.Component {
    constructor(props) {

        super(props);

        this.input = {};
        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        if (this.input.name) {
            this.input.name.focus();
        }
    }

    componentWillUnmount() {

        this.unsubscribeStore();

        Actions.resetStore();
    }

    onStoreChange() {

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

    render() {

        const alerts = [];

        if (this.state.success) {
            alerts.push(
                <div key="success" className="alert alert-success">
                    Success. Redirecting...
                </div>
            );
        }

        if (this.state.validation.error) {
            alerts.push(
                <div key="danger" className="alert alert-danger">
                    {this.state.validation.error}
                </div>
            );
        }

        let formElements;

        if (!this.state.success) {
            formElements = <fieldset>
                <TextControl
                    ref={(c) => (this.input.name = c)}
                    name="name"
                    label="Name"
                    hasError={this.state.validation.hasError.name}
                    help={this.state.validation.help.name}
                    disabled={this.state.loading}
                />
                <TextControl
                    ref={(c) => (this.input.email = c)}
                    name="email"
                    label="Email"
                    hasError={this.state.validation.hasError.email}
                    help={this.state.validation.help.email}
                    disabled={this.state.loading}
                />
                <TextControl
                    ref={(c) => (this.input.username = c)}
                    name="username"
                    label="Username"
                    hasError={this.state.validation.hasError.username}
                    help={this.state.validation.help.username}
                    disabled={this.state.loading}
                />
                <TextControl
                    ref={(c) => (this.input.password = c)}
                    name="password"
                    label="Password"
                    type="password"
                    hasError={this.state.validation.hasError.password}
                    help={this.state.validation.help.password}
                    disabled={this.state.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-success': true }}
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
                <form onSubmit={this.handleSubmit.bind(this)} method="post">
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
}


module.exports = Form;
