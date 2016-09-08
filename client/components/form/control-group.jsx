'use strict';
const ClassNames = require('classnames');
const ObjectAssign = require('object-assign');
const React = require('react');


const propTypes = {
    children: React.PropTypes.node,
    groupClasses: React.PropTypes.object,
    hasError: React.PropTypes.bool,
    help: React.PropTypes.string,
    helpClasses: React.PropTypes.object,
    hideHelp: React.PropTypes.bool,
    hideLabel: React.PropTypes.bool,
    label: React.PropTypes.string,
    labelClasses: React.PropTypes.object
};


class ControlGroup extends React.Component {
    render() {

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

        let label;

        if (!this.props.hideLabel) {
            label = <label className={labelClasses}>
                {this.props.label}
            </label>;
        }

        let help;

        if (!this.props.hideHelp) {
            help = <span className={helpClasses}>
                {this.props.help}
            </span>;
        }

        return (
            <div className={groupClasses}>
                {label}
                {this.props.children}
                {help}
            </div>
        );
    }
}

ControlGroup.propTypes = propTypes;


module.exports = ControlGroup;
