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
        name: PropTypes.shape({
            first: PropTypes.string,
            middle: PropTypes.string,
            last: PropTypes.string
        })
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


class DetailsForm extends React.Component {
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

        Actions.saveDetails({
            name: this.state.name
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
                    <legend>Contact info</legend>
                    {alerts}
                    <TextControl
                        name="name.first"
                        label="First name"
                        value={this.state.name.first}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.validation.hasError['name.first']}
                        help={this.props.validation.help['name.first']}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="name.middle"
                        label="Middle name"
                        value={this.state.name.middle}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.validation.hasError['name.middle']}
                        help={this.props.validation.help['name.middle']}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="name.last"
                        label="Last name"
                        value={this.state.name.last}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.validation.hasError['name.last']}
                        help={this.props.validation.help['name.last']}
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
