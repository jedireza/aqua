'use strict';
const Actions = require('../actions');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const React = require('react');
const ReactRouter = require('react-router');
const Spinner = require('../../../components/form/spinner.jsx');
const Store = require('./store');
const TextControl = require('../../../components/form/text-control.jsx');


const Link = ReactRouter.Link;


class ForgotPage extends React.Component {
    constructor(props) {

        super(props);

        this.input = {};
        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        if (this.input.email) {
            this.input.email.focus();
        }
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.forgot({
            email: this.input.email.value()
        });
    }

    render() {

        const alerts = [];

        if (this.state.success) {
            alerts.push(<div key="success">
                <div className="alert alert-success">
                    If an account matched that address, an email will be sent with instructions.
                </div>
                <Link to="/login" className="btn btn-link">Back to login</Link>
            </div>);
        }

        if (this.state.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.state.error}
            </div>);
        }

        let formElements;

        if (!this.state.success) {
            formElements = <fieldset>
                <TextControl
                    ref={(c) => (this.input.email = c)}
                    name="email"
                    label="What's your email?"
                    hasError={this.state.hasError.email}
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
                <form onSubmit={this.handleSubmit.bind(this)}>
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
}


module.exports = ForgotPage;
