var React = require('react/addons');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../components/form/ControlGroup.react');
var TextControl = require('../../../components/form/TextControl.react');
var Button = require('../../../components/form/Button.react');
var Spinner = require('../../../components/form/Spinner.react');
var Actions = require('../Actions');
var ForgotStore = require('../stores/Forgot');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;
var Navigation = ReactRouter.Navigation;


var Component = React.createClass({
    mixins: [ LinkedState, Navigation ],
    getInitialState: function () {

        ForgotStore.reset();
        return ForgotStore.getState();
    },
    componentDidMount: function () {

        ForgotStore.addChangeListener(this.onStoreChange);
        this.refs.email.refs.inputField.getDOMNode().focus();
    },
    componentWillUnmount: function () {

        ForgotStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState(ForgotStore.getState());
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.forgot({
            email: this.state.email
        });
    },
    render: function () {

        var alerts = [];
        if (this.state.success) {
            alerts.push(<div key="success">
                <div className="alert alert-success">
                    If an account matched that address, an email will be sent with instructions.
                </div>
                <Link to="home" className="btn btn-link">Back to login</Link>
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
                    name="email"
                    label="What's your email?"
                    ref="email"
                    hasError={this.state.hasError.email}
                    valueLink={this.linkState('email')}
                    help={this.state.help.email}
                    disabled={this.state.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{'btn-primary': true}}
                        disabled={this.state.loading}>

                        Send reset
                        <Spinner space="left" show={this.state.loading} />
                    </Button>
                    <Link to="home" className="btn btn-link">Back to login</Link>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <section>
                <h1 className="page-header">Forgot your password?</h1>
                <form onSubmit={this.handleSubmit}>
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
});


module.exports = Component;
