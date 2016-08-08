/* global window */
'use strict';
const React = require('react');
const ControlGroup = require('../../../../components/form/control-group');
const Button = require('../../../../components/form/button');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions/status');


class Component extends React.Component {
    getInitialState () {

        return {};
    }

    handleSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.delete({
            id: this.props.details._id
        }, this.context.history);
    }

    onConfirm (event) {

        if (!window.confirm('Are you sure?')) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    render () {

        let alerts;

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
}

Component.contextTypes = {
    history: React.PropTypes.object
};


module.exports = Component;
