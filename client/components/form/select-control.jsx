'use strict';
const ClassNames = require('classnames');
const ControlGroup = require('./control-group.jsx');
const ObjectAssign = require('object-assign');
const PropTypes = require('prop-types');
const React = require('react');


const propTypes = {
    children: PropTypes.node,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    hasError: PropTypes.bool,
    help: PropTypes.string,
    inputClasses: PropTypes.object,
    label: PropTypes.string,
    multiple: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    size: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ])
};
const defaultProps = {
    type: 'text'
};


class SelectControl extends React.Component {
    value() {

        return this.input.value;
    }

    render() {

        const inputClasses = ClassNames(ObjectAssign({
            'form-control': true
        }, this.props.inputClasses));

        return (
            <ControlGroup
                hasError={this.props.hasError}
                label={this.props.label}
                help={this.props.help}>

                <select
                    ref={(c) => (this.input = c)}
                    multiple={this.props.multiple}
                    className={inputClasses}
                    name={this.props.name}
                    size={this.props.size}
                    value={this.props.value}
                    defaultValue={this.props.defaultValue}
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}>

                    {this.props.children}
                </select>
            </ControlGroup>
        );
    }
}

SelectControl.propTypes = propTypes;
SelectControl.defaultProps = defaultProps;


module.exports = SelectControl;
