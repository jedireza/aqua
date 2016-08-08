'use strict';
const React = require('react');
const ObjectAssign = require('object-assign');
const ControlGroup = require('./control-group');
const ClassNames = require('classnames');


class Component extends React.Component {
    value () {

        return this.input.value;
    }

    render () {

        const inputClasses = ClassNames(ObjectAssign({
            'form-control': true
        }, this.props.inputClasses));

        return (
            <ControlGroup
                hasError={this.props.hasError}
                label={this.props.label}
                help={this.props.help}>

                <select
                    ref={(input) => { this.input = input }}
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

Component.defaultProps = {
  type: 'text'
};


module.exports = Component;
