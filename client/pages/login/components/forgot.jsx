'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ControlGroup = require('../../../components/form/control-group');
const TextControl = require('../../../components/form/text-control');
const Button = require('../../../components/form/button');
const Spinner = require('../../../components/form/spinner');
const Actions = require('../actions');
const ForgotStore = require('../stores/forgot');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        ForgotStore.reset();
        return ForgotStore.getState();
    }

    componentDidMount () {

        ForgotStore.addChangeListener(this.onStoreChange);
        this.refs.email.refs.inputField.focus();
    }

    componentWillUnmount () {

        ForgotStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState(ForgotStore.getState());
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.forgot({
            email: this.state.email
        });
    }

    render () {

        const alerts = [];

        if (this.state.success) {
            alerts.push(<div key="success">
                <div className="alert alert-success">
                    If an account matched that address, an email will be sent with instructions.
                </div>
                <Link to="/login" className="btn btn-link">Back to login</Link>
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
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.state.loading}>

                        Send reset
                        <Spinner space="left" show={this.state.loading} />
                    </Button>
                    <Link to="/login" className="btn btn-link">Back to login</Link>
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
}


module.exports = Component;
