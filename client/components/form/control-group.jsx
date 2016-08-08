'use strict';
const React = require('react');
const ObjectAssign = require('object-assign');
const ClassNames = require('classnames');


class Component extends React.Component {
    render () {

        const groupClasses = ClassNames(ObjectAssign({
            'form-group': true,
            'has-error': this.props.hasError
        }, this.props.groupClasses));

        const labelClasses = ClassNames(ObjectAssign({
            'control-label': true
        }, this.props.labelClasses));

        const helpClasses = ClassNames(ObjectAssign({
            'help-block': true
        }, this.props.helpClasses));

        let labelComponent;

        if (!this.props.hideLabel) {
            labelComponent = <label className={labelClasses}>
                {this.props.label}
            </label>;
        }

        let helpComponent;

        if (!this.props.hideHelp) {
            helpComponent = <span className={helpClasses}>
                {this.props.help}
            </span>;
        }

        return (
            <div className={groupClasses}>
                {labelComponent}
                {this.props.children}
                {helpComponent}
            </div>
        );
    }
}


module.exports = Component;
