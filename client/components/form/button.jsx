'use strict';
const ClassNames = require('classnames');
const ObjectAssign = require('object-assign');
const PropTypes = require('prop-types');
const React = require('react');


const propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    inputClasses: PropTypes.object,
    name: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    value: PropTypes.string
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
