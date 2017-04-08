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
    pivot: PropTypes.string,
    show: PropTypes.bool
};


class CreateNewForm extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
        this.state = {
            showing: false,
            pivot: '',
            name: ''
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            pivot: nextProps.pivot,
            name: nextProps.name
        });
    }

    componentDidUpdate() {

        if (this.props.show && this.state.pivot.length === 0) {
            this.els.pivot.focus();
        }
    }

    onSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.createNew({
            pivot: this.state.pivot,
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
                name="pivot"
                label="Pivot"
                ref={(c) => (this.els.pivot = c)}
                value={this.state.pivot}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError.pivot}
                help={this.props.help.pivot}
                disabled={this.props.loading}
            />
            <TextControl
                name="name"
                label="Name"
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
