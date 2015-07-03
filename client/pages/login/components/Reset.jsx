var React = require('react/addons');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../components/form/ControlGroup');
var TextControl = require('../../../components/form/TextControl');
var Button = require('../../../components/form/Button');
var Spinner = require('../../../components/form/Spinner');
var Actions = require('../Actions');
var ResetStore = require('../stores/Reset');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedState],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {

        ResetStore.reset();
        return ResetStore.getState();
    },
    componentDidMount: function () {

        ResetStore.addChangeListener(this.onStoreChange);
        this.refs.password.refs.inputField.getDOMNode().focus();
    },
    componentWillUnmount: function () {

        ResetStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState(ResetStore.getState());
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.reset({
            email: this.context.router.getCurrentParams().email,
            key: this.context.router.getCurrentParams().key,
            password: this.state.password
        });
    },
    render: function () {

        var alerts = [];
        if (this.state.success) {
            alerts.push(<div key="success">
                <div className="alert alert-success">
                    Your password has been reset. Please login to confirm.
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
                    value={this.context.router.getCurrentParams().key}
                    help={this.state.help.key}
                    disabled={true}
                />
                <TextControl
                    name="_email"
                    label="Email"
                    hasError={this.state.hasError.email}
                    value={this.context.router.getCurrentParams().email}
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
                    <Link to="home" className="btn btn-link">Back to login</Link>
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
});


module.exports = Component;
