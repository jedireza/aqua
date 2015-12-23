'use strict';
const ClassNames = require('classnames');
const ControlGroup = require('./control-group.jsx');
const ObjectAssign = require('object-assign');
const React = require('react');


const propTypes = {
    children: React.PropTypes.node,
    defaultValue: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    hasError: React.PropTypes.bool,
    help: React.PropTypes.string,
    inputClasses: React.PropTypes.object,
    label: React.PropTypes.string,
    multiple: React.PropTypes.string,
    name: React.PropTypes.string,
    onChange: React.PropTypes.func,
    size: React.PropTypes.string,
    value: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string
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
