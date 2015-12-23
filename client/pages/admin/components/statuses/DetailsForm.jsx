var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ControlGroup = require('../../../../components/form/ControlGroup.jsx');
var TextControl = require('../../../../components/form/TextControl.jsx');
var Button = require('../../../../components/form/Button.jsx');
var Spinner = require('../../../../components/form/Spinner.jsx');
var Actions = require('../../actions/Status');


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function () {

        return {};
    },
    componentWillReceiveProps: function (nextProps) {

        if (!this.state.hydrated) {
            this.setState({
                hydrated: nextProps.data.hydrated,
                pivot: nextProps.data.pivot,
                name: nextProps.data.name
            });
        }
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveDetails({
            id: this.props.data._id,
            name: this.state.name
        });
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
        if (!this.props.data.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        var formElements;
        if (this.props.data.hydrated) {
            formElements = <fieldset>
                <legend>Details</legend>
                {alerts}
                <TextControl
                    name="pivot"
                    label="Pivot"
                    hasError={this.props.data.hasError.pivot}
                    valueLink={this.linkState('pivot')}
                    help={this.props.data.help.pivot}
                    disabled={true}
                />
                <TextControl
                    name="name"
                    label="Name"
                    hasError={this.props.data.hasError.name}
                    valueLink={this.linkState('name')}
                    help={this.props.data.help.name}
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
});


module.exports = Component;
