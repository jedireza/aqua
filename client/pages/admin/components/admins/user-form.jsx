/* global window */
'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ControlGroup = require('../../../../components/form/control-group');
const TextControl = require('../../../../components/form/text-control');
const Button = require('../../../../components/form/button');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions/admin');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        return {};
    }

    componentWillReceiveProps (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.details.hydrated,
                user: nextProps.details.user
            });
        }
    }

    handleSubmit (event) {

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
    }

    onConfirm (event) {

        if (!window.confirm('Are you sure?')) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    render () {

        const alerts = [];

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

        let notice;

        if (!this.props.details.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        let formElements;

        if (this.props.details.hydrated) {
            const isLinked = Boolean(this.props.details.user);

            let username;

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
                                to={`/admin/users/${this.props.details.user.id}`}
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
}


module.exports = Component;
