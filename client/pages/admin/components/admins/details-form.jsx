'use strict';
const React = require('react');
const ControlGroup = require('../../../../components/form/control-group');
const TextControl = require('../../../../components/form/text-control');
const Button = require('../../../../components/form/button');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions/admin');


class Component extends React.Component {
    getInitialState () {

        return {};
    }

    componentWillReceiveProps (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.data.hydrated,
                nameFirst: nextProps.data.name.first,
                nameMiddle: nextProps.data.name.middle,
                nameLast: nextProps.data.name.last
            });
        }
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveDetails({
            id: this.props.data._id,
            nameFirst: this.state.nameFirst,
            nameMiddle: this.state.nameMiddle,
            nameLast: this.state.nameLast
        });
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

        if (!this.props.data.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        let formElements;

        if (this.props.data.hydrated) {
            formElements = <fieldset>
                <legend>Details</legend>
                {alerts}
                <TextControl
                    name="nameFirst"
                    label="First name"
                    hasError={this.props.data.hasError.nameFirst}
                    valueLink={this.linkState('nameFirst')}
                    help={this.props.data.help.nameFirst}
                    disabled={this.props.data.loading}
                />
                <TextControl
                    name="nameMiddle"
                    label="Middle name"
                    hasError={this.props.data.hasError.nameMiddle}
                    valueLink={this.linkState('nameMiddle')}
                    help={this.props.data.help.nameMiddle}
                    disabled={this.props.data.loading}
                />
                <TextControl
                    name="nameLast"
                    label="Last name"
                    hasError={this.props.data.hasError.nameLast}
                    valueLink={this.linkState('nameLast')}
                    help={this.props.data.help.nameLast}
                    disabled={this.props.data.loading}
                />
                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.props.data.loading}>

                        Save changes
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
