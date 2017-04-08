'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const Button = require('../../../../components/form/button.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../../components/form/spinner.jsx');
const TextControl = require('../../../../components/form/text-control.jsx');


const propTypes = {
    _id: PropTypes.string,
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    loading: PropTypes.bool,
    name: PropTypes.object,
    showSaveSuccess: PropTypes.bool
};


class DetailsForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            name: props.name
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            name: nextProps.name
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        const id = this.props._id;
        const data = {
            name: this.state.name
        };

        Actions.saveDetails(id, data);
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideDetailsSaveSuccess}
                message="Success. Changes have been saved."
            />);
        }

        if (this.props.error) {
            alerts.push(<Alert
                key="danger"
                type="danger"
                message={this.props.error}
            />);
        }

        const formElements = <fieldset>
            <legend>Details</legend>
            {alerts}
            <TextControl
                name="name.first"
                label="First name"
                value={this.state.name.first}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError['name.first']}
                help={this.props.help['name.first']}
                disabled={this.props.loading}
            />
            <TextControl
                name="name.middle"
                label="Middle name"
                value={this.state.name.middle}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError['name.middle']}
                help={this.props.help['name.middle']}
                disabled={this.props.loading}
            />
            <TextControl
                name="name.last"
                label="Last name"
                value={this.state.name.last}
                onChange={LinkState.bind(this)}
                hasError={this.props.hasError['name.last']}
                help={this.props.help['name.last']}
                disabled={this.props.loading}
            />
            <ControlGroup hideLabel={true} hideHelp={true}>
                <Button
                    type="submit"
                    inputClasses={{ 'btn-primary': true }}
                    disabled={this.props.loading}>

                    Save changes
                    <Spinner space="left" show={this.props.loading} />
                </Button>
            </ControlGroup>
        </fieldset>;

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                {formElements}
            </form>
        );
    }
}

DetailsForm.propTypes = propTypes;


module.exports = DetailsForm;
