'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const Button = require('../../../../components/form/button.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state.js');
const Modal = require('../../../../components/modal.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../../components/form/spinner.jsx');
const TextControl = require('../../../../components/form/text-control.jsx');


const propTypes = {
    email: PropTypes.string,
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    history: PropTypes.object,
    loading: PropTypes.bool,
    password: PropTypes.string,
    show: PropTypes.bool,
    username: PropTypes.string
};


class CreateNewForm extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
        this.state = {
            showing: false,
            username: '',
            email: '',
            password: ''
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            username: nextProps.username,
            email: nextProps.email,
            password: nextProps.password
        });
    }

    componentDidUpdate() {

        if (this.props.show && this.state.username.length === 0) {
            this.els.username.focus();
        }
    }

    onSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.createNew({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }, this.props.history);
    }

    render() {

        let alert;

        if (this.props.error) {
            alert = <Alert
                type="danger"
                message={this.props.error}
            />;
        }

        const formElements = <fieldset>
            {alert}
            <TextControl
                ref={(c) => (this.els.username = c)}
                name="username"
                label="Username"
                value={this.state.username}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError.username}
                help={this.props.help.username}
                disabled={this.props.loading}
            />
            <TextControl
                name="email"
                label="Email"
                value={this.state.email}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError.email}
                help={this.props.help.email}
                disabled={this.props.loading}
            />
            <TextControl
                name="password"
                label="Password"
                type="password"
                value={this.state.password}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError.password}
                help={this.props.help.password}
                disabled={this.props.loading}
            />
            <ControlGroup hideLabel={true} hideHelp={true}>
                <Button
                    type="submit"
                    inputClasses={{ 'btn-primary': true }}
                    disabled={this.props.loading}>

                    Create new
                    <Spinner space="left" show={this.props.loading} />
                </Button>
            </ControlGroup>
        </fieldset>;

        return (
            <Modal
                header="Create new"
                show={this.props.show}
                onClose={Actions.hideCreateNew}>

                <form onSubmit={this.onSubmit.bind(this)}>
                    {formElements}
                </form>
            </Modal>
        );
    }
}

CreateNewForm.propTypes = propTypes;


module.exports = CreateNewForm;
