/* global window */
var React = require('react/addons');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../../components/form/ControlGroup');
var TextControl = require('../../../../components/form/TextControl');
var Button = require('../../../../components/form/Button');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/Admin');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedState],
    getInitialState: function () {

        return {};
    },
    componentWillReceiveProps: function (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.details.hydrated,
                user: nextProps.details.user
            });
        }
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.props.details.user) {
            Actions.unlinkUser({
                id: this.props.details._id
            });

            this.setState({ username: '' });
        }
        else {
            Actions.linkUser({
                id: this.props.details._id,
                username: this.state.username
            });
        }
    },
    onConfirm: function (event) {

        if (!window.confirm('Are you sure?')) {
            event.preventDefault();
            event.stopPropagation();
        }
    },
    render: function () {

        var alerts = [];
        if (this.props.data.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. Changes have been saved.
            </div>);
        }
        else if (this.props.data.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.props.data.error}
            </div>);
        }

        var notice;
        if (!this.props.details.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        var formElements;
        if (this.props.details.hydrated) {
            var isLinked = Boolean(this.props.details.user);

            var username;
            if (isLinked) {
                username = <ControlGroup label="Username">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            value={this.props.details.user.name}
                        />
                        <span className="input-group-btn">
                            <Link
                                to="userDetails"
                                params={{ id: this.props.details.user.id }}
                                className="btn btn-default">

                                View
                            </Link>
                        </span>
                    </div>
                </ControlGroup>;
            }
            else {
                username = <TextControl
                    name="username"
                    label="Username"
                    hasError={this.props.data.hasError.username}
                    valueLink={this.linkState('username')}
                    help={this.props.data.help.username}
                    disabled={this.props.data.loading}
                />;
            }

            formElements = <fieldset>
                <legend>User</legend>
                {alerts}
                {username}
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{
                            'btn-primary': !isLinked,
                            'btn-danger': isLinked
                        }}
                        onClick={isLinked ? this.onConfirm : undefined}
                        disabled={this.props.data.loading}>

                        {isLinked ? 'Unlink user' : 'Link user'}
                        <Spinner space="left" show={this.props.data.loading} />
                    </Button>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                {notice}
                {formElements}
            </form>
        );
    }
});


module.exports = Component;
