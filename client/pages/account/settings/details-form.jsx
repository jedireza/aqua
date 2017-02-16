'use strict';
const Actions = require('./actions');
const Alert = require('../../../components/alert.jsx');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const TextControl = require('../../../components/form/text-control.jsx');


const propTypes = {
    hydrated: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    showSaveSuccess: React.PropTypes.bool,
    error: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    first: React.PropTypes.string,
    middle: React.PropTypes.string,
    last: React.PropTypes.string
};


class DetailsForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            first: props.first,
            middle: props.middle,
            last: props.last
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            first: nextProps.first,
            middle: nextProps.middle,
            last: nextProps.last
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveDetails({
            first: this.state.first,
            middle: this.state.middle,
            last: this.state.last
        });
    }

    render() {

        if (!this.props.hydrated) {
            return (
                <div className="alert alert-info">
                    Loading contact info data...
                </div>
            );
        }

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

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <fieldset>
                    <legend>Contact info</legend>
                    {alerts}
                    <TextControl
                        name="first"
                        label="First name"
                        value={this.state.first}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError.first}
                        help={this.props.help.first}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="middle"
                        label="Middle name"
                        value={this.state.middle}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError.middle}
                        help={this.props.help.middle}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="last"
                        label="Last name"
                        value={this.state.last}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError.last}
                        help={this.props.help.last}
                        disabled={this.props.loading}
                    />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.loading}>

                            Update contact info
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

DetailsForm.propTypes = propTypes;


module.exports = DetailsForm;
