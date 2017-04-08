'use strict';
const ClassNames = require('classnames');
const ObjectAssign = require('object-assign');
const PropTypes = require('prop-types');
const React = require('react');


const propTypes = {
    children: PropTypes.node,
    groupClasses: PropTypes.object,
    hasError: PropTypes.bool,
    help: PropTypes.string,
    helpClasses: PropTypes.object,
    hideHelp: PropTypes.bool,
    hideLabel: PropTypes.bool,
    label: PropTypes.string,
    labelClasses: PropTypes.object
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
