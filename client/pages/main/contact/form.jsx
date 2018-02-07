'use strict';
const Actions = require('./actions');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const Store = require('./store');
const TextControl = require('../../../components/form/text-control.jsx');
const TextareaControl = require('../../../components/form/textarea-control.jsx');


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

        Actions.sendMessage({
            name: this.input.name.value(),
            email: this.input.email.value(),
            message: this.input.message.value()
        });
    }

    render() {

        const alerts = [];

        if (this.state.success) {
            alerts.push(
                <div key="success" className="alert alert-success">
                    Success. We have received your message.
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
                    label="Your name"
                    hasError={this.state.validation.hasError.name}
                    help={this.state.validation.help.name}
                    disabled={this.state.loading}
                />
                <TextControl
                    ref={(c) => (this.input.email = c)}
                    name="email"
                    label="Your email"
                    hasError={this.state.validation.hasError.email}
                    help={this.state.validation.help.email}
                    disabled={this.state.loading}
                />
                <TextareaControl
                    ref={(c) => (this.input.message = c)}
                    name="message"
                    label="Message"
                    rows="5"
                    hasError={this.state.validation.hasError.message}
                    help={this.state.validation.help.message}
                    disabled={this.state.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.state.loading}>

                        Send message
                        <Spinner space="left" show={this.state.loading} />
                    </Button>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <section>
                <h1 className="page-header">Send a message</h1>
                <form onSubmit={this.handleSubmit.bind(this)} method="post">
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
}


module.exports = Form;
