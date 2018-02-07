'use strict';
const Actions = require('./actions');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const TextControl = require('../../../components/form/text-control.jsx');


const propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string,
        username: PropTypes.string
    }),
    hydrated: PropTypes.bool,
    loading: PropTypes.bool,
    showSaveSuccess: PropTypes.bool,
    validation: PropTypes.shape({
        error: PropTypes.string,
        hasError: PropTypes.object,
        help: PropTypes.object
    })
};


class UserForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = props.data;
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.hasOwnProperty('data')) {
            this.setState(nextProps.data);
        }
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveUser({
            username: this.state.username,
            email: this.state.email
        });
    }

    render() {

        if (!this.props.hydrated) {
            return (
                <div className="alert alert-info">
                    Loading identity data...
                </div>
            );
        }

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(
                <div key="success" className="alert alert-success">
                    Success. Changes have been saved.
                </div>
            );
        }

        if (this.props.validation.error) {
            alerts.push(
                <div key="danger" className="alert alert-danger">
                    {this.props.validation.error}
                </div>
            );
        }

        return (
            <form onSubmit={this.handleSubmit.bind(this)} method="post">
                <fieldset>
                    <legend>Identity</legend>
                    {alerts}
                    <TextControl
                        name="username"
                        label="Username"
                        value={this.state.username}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.validation.hasError.username}
                        help={this.props.validation.help.username}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="email"
                        label="Email"
                        value={this.state.email}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.validation.hasError.email}
                        help={this.props.validation.help.email}
                        disabled={this.props.loading}
                    />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.loading}>

                            Update identity
                            <Spinner
                                space="left"
                                show={this.props.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
}

UserForm.propTypes = propTypes;


module.exports = UserForm;
