'use strict';
const ClassNames = require('classnames');
const ObjectAssign = require('object-assign');
const React = require('react');


class Component extends React.Component {
    render () {

        const inputClasses = ClassNames(ObjectAssign({
            'btn': true
        }, this.props.inputClasses));

        return (
            <button
                type={this.props.type}
                className={inputClasses}
                name={this.props.name}
                value={this.props.value}
                disabled={this.props.disabled ? 'disabled' : undefined}
                onClick={this.props.onClick}>

                {this.props.children}
            </button>
        );
    }
}

Component.defaultProps = {
    type: 'button'
};


module.exports = Component;
