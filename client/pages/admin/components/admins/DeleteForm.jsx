/* global window */
var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var Button = require('../../../../components/form/Button');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/Admin');


var LinkedState = React.addons.LinkedStateMixin;


var Component = React.createClass({
    mixins: [LinkedState],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {

        return {};
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.delete({
            id: this.props.details._id
        }, this.context.router);
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
