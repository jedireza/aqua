'use strict';
const React = require('react');
const Modal = require('../../../../components/modal');
const ControlGroup = require('../../../../components/form/control-group');
const TextControl = require('../../../../components/form/text-control');
const Button = require('../../../../components/form/button');
const Spinner = require('../../../../components/form/spinner');
const Actions = require('../../actions/status');


class Component extends React.Component {
    getDefaultProps () {

        return {
            data: {
                hasError: {},
                help: {}
            }
        };
    }

    getInitialState () {

        return {};
    }

    componentWillUnmount () {

        clearTimeout(this.timeout);
    }

    componentWillReceiveProps (nextProps) {

        if (!nextProps.data.show) {
            this.replaceState({});
        }
        else {
            this.timeout = setTimeout(function () {

                this.refs.pivot.refs.inputField.focus();
            }.bind(this), 100);
        }
    }

    onSubmit (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.createNew({
            pivot: this.state.pivot,
            name: this.state.name
        }, this.context.location);
    }

    render () {

        let alerts;

        if (this.props.data.error) {
            alerts = <div className="alert alert-danger">
                {this.props.data.error}
            </div>;
        }

        let notice;

        if (this.props.data.success) {
            notice = <div className="alert alert-success">
                Loading data...
            </div>;
        }

        let formElements;

        if (!this.props.data.success) {
            formElements = <fieldset>
                {alerts}
                <TextControl
                    name="pivot"
                    ref="pivot"
                    label="Pivot"
                    hasError={this.props.data.hasError.pivot}
                    valueLink={this.linkState('pivot')}
                    help={this.props.data.help.pivot}
                    disabled={this.props.data.loading}
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
}

Component.contextTypes = {
    location: React.PropTypes.object
};


module.exports = Component;
