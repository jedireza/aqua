var React = require('react/addons');
var ObjectAssign = require('object-assign');
var ClassNames = require('classnames');


var View = React.createClass({
    getDefaultProps: function () {

        return {
            type: 'button'
        };
    },
    render: function () {

        var inputClasses = ClassNames(ObjectAssign({
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
});


module.exports = View;
