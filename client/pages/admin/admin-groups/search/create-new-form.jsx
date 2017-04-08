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
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    history: PropTypes.object,
    loading: PropTypes.bool,
    name: PropTypes.string,
    show: PropTypes.bool
};


class CreateNewForm extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
        this.state = {
            showing: false,
            name: ''
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            name: nextProps.name
        });
    }

    componentDidUpdate() {

        if (this.props.show && this.state.name.length === 0) {
            this.els.name.focus();
        }
    }

    onSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.createNew({
            name: this.state.name
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
                name="name"
                label="Name"
                ref={(c) => (this.els.name = c)}
                value={this.state.name}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError.name}
                help={this.props.help.name}
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
