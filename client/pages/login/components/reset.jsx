'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ControlGroup = require('../../../components/form/control-group');
const TextControl = require('../../../components/form/text-control');
const Button = require('../../../components/form/button');
const Spinner = require('../../../components/form/spinner');
const Actions = require('../actions');
const ResetStore = require('../stores/reset');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        ResetStore.reset();
        return ResetStore.getState();
    }

    componentDidMount () {

        ResetStore.addChangeListener(this.onStoreChange);
        this.refs.password.refs.inputField.focus();
    }

    componentWillUnmount () {

        ResetStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState(ResetStore.getState());
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.reset({
            email: this.props.params.email,
            key: this.props.params.key,
            password: this.state.password
        });
    }

    render () {

        const alerts = [];

        if (this.state.success) {
            alerts.push(<div key="success">
                <div className="alert alert-success">
                    Your password has been reset. Please login to confirm.
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
                    name="password"
                    label="New password"
                    type="password"
                    ref="password"
                    hasError={this.state.hasError.password}
                    valueLink={this.linkState('password')}
                    help={this.state.help.password}
                    disabled={this.state.loading}
                />
                <TextControl
                    name="_key"
                    label="Key"
                    hasError={this.state.hasError.key}
                    value={this.props.params.key}
                    help={this.state.help.key}
                    disabled={true}
                />
                <TextControl
                    name="_email"
                    label="Email"
                    hasError={this.state.hasError.email}
                    value={this.props.params.email}
                    help={this.state.help.email}
                    disabled={true}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.state.loading}>

                        Set password
                        <Spinner space="left" show={this.state.loading} />
                    </Button>
                    <Link to="/login" className="btn btn-link">Back to login</Link>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <section>
                <h1 className="page-header">Reset your password</h1>
                <form onSubmit={this.handleSubmit}>
                    {alerts}
                    {formElements}
                </form>
            </section>
        );
    }
}


module.exports = Component;
