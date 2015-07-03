var React = require('react/addons');
var ControlGroup = require('../../components/form/ControlGroup');
var TextControl = require('../../components/form/TextControl');
var TextareaControl = require('../../components/form/TextareaControl');
var Button = require('../../components/form/Button');
var Spinner = require('../../components/form/Spinner');
var Actions = require('./Actions');
var Store = require('./Store');


var Component = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {

        Store.reset();
        return Store.getState();
    },
    componentDidMount: function () {

        Store.addChangeListener(this.onStoreChange);
        this.refs.nameControl.refs.inputField.getDOMNode().focus();
    },
    componentWillUnmount: function () {

        Store.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState(Store.getState());
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.sendMessage({
            name: this.state.name,
            email: this.state.email,
            message: this.state.message
        });
    },
    render: function () {

        var alerts = [];
        if (this.state.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. We have received your message.
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
                    name="name"
                    label="Your name"
                    ref="nameControl"
                    hasError={this.state.hasError.name}
                    valueLink={this.linkState('name')}
                    help={this.state.help.name}
                    disabled={this.state.loading}
                />
                <TextControl
                    name="email"
                    label="Your email"
                    hasError={this.state.hasError.email}
                    valueLink={this.linkState('email')}
                    help={this.state.help.email}
                    disabled={this.state.loading}
                />
                <TextareaControl
                    name="message"
                    label="Message"
                    rows="5"
                    hasError={this.state.hasError.message}
                    valueLink={this.linkState('message')}
                    help={this.state.help.message}
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
                <form onSubmit={this.handleSubmit}>
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
});


module.exports = Component;
