var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var Modal = require('../../../../components/Modal.jsx');
var ControlGroup = require('../../../../components/form/ControlGroup.jsx');
var TextControl = require('../../../../components/form/TextControl.jsx');
var Button = require('../../../../components/form/Button.jsx');
var Spinner = require('../../../../components/form/Spinner.jsx');
var Actions = require('../../actions/AdminGroup');


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    getDefaultProps: function () {

        return {
            data: {
                hasError: {},
                help: {}
            }
        };
    },
    getInitialState: function () {

        return {};
    },
    componentWillUnmount: function () {

        clearTimeout(this.timeout);
    },
    componentWillReceiveProps: function (nextProps) {

        if (!nextProps.data.show) {
            this.replaceState({});
        }
        else {
            this.timeout = setTimeout(function () {

                this.refs.name.refs.inputField.focus();
            }.bind(this), 100);
        }
    },
    onSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.createNew({
            name: this.state.name
        }, this.context.location);
    },
    render: function () {

        var alerts;
        if (this.props.data.error) {
            alerts = <div className="alert alert-danger">
                {this.props.data.error}
            </div>;
        }

        var notice;
        if (this.props.data.success) {
            notice = <div className="alert alert-success">
                Loading data...
            </div>;
        }

        var formElements;
        if (!this.props.data.success) {
            formElements = <fieldset>
                {alerts}
                <TextControl
                    name="name"
                    ref="name"
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

                        Create new
                        <Spinner space="left" show={this.props.data.loading} />
                    </Button>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <Modal
                header="Create new"
                show={this.props.data.show}
                onClose={Actions.hideCreateNew}>

                <form onSubmit={this.onSubmit}>
                    {notice}
                    {formElements}
                </form>
            </Modal>
        );
    }
});


module.exports = Component;
