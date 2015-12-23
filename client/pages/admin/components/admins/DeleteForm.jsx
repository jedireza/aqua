/* global window */
var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ControlGroup = require('../../../../components/form/ControlGroup.jsx');
var Button = require('../../../../components/form/Button.jsx');
var Spinner = require('../../../../components/form/Spinner.jsx');
var Actions = require('../../actions/Admin');


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    contextTypes: {
        history: React.PropTypes.object
    },
    getInitialState: function () {

        return {};
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.delete({
            id: this.props.details._id
        }, this.context.history);
    },
    onConfirm: function (event) {

        if (!window.confirm('Are you sure?')) {
            event.preventDefault();
            event.stopPropagation();
        }
    },
    render: function () {

        var alerts;
        if (this.props.data.error) {
            alerts = <div className="alert alert-danger">
                {this.props.data.error}
            </div>;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>Danger zone</legend>
                    <p>
                        <span className="label label-danger">Warning</span>
                        &nbsp;This cannot be undone and could result in
                        orphaned document relationships.
                    </p>
                    {alerts}
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-danger': true }}
                            disabled={this.props.data.loading}
                            onClick={this.onConfirm}>

                            Delete
                            <Spinner
                                space="left"
                                show={this.props.data.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
});


module.exports = Component;
