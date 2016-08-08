'use strict';
const React = require('react');
const ObjectAssign = require('object-assign');
const ControlGroup = require('./control-group');
const ClassNames = require('classnames');


class Component extends React.Component {
    focus () {

        return this.input.focus();
    }

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

                <input
                    ref={(input) => { this.input = input }}
                    type={this.props.type}
                    autoCapitalize={this.props.autoCapitalize}
                    className={inputClasses}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    disabled={this.props.disabled ? 'disabled' : undefined}
                    onChange={this.props.onChange}
                />
            </ControlGroup>
        );
    }
}

Component.defaultProps = {
  type: 'text',
  autoCapitalize: 'off'
};



module.exports = Component;
