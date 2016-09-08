'use strict';
const ClassNames = require('classnames');
const ObjectAssign = require('object-assign');
const React = require('react');


const propTypes = {
    children: React.PropTypes.node,
    disabled: React.PropTypes.bool,
    inputClasses: React.PropTypes.object,
    name: React.PropTypes.string,
    onClick: React.PropTypes.func,
    type: React.PropTypes.string,
    value: React.PropTypes.string
};
const defaultProps = {
    type: 'button'
};


class Button extends React.Component {
    render() {

        const inputClasses = ClassNames(ObjectAssign({
            'btn': true
        }, this.props.inputClasses));

        return (
            <button
                type={this.props.type}
                className={inputClasses}
                name={this.props.name}
                value={this.props.value}
                disabled={this.props.disabled}
                onClick={this.props.onClick}>

                {this.props.children}
            </button>
        );
    }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;


module.exports = Button;
