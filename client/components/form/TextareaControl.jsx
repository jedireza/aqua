var React = require('react');
var ObjectAssign = require('object-assign');
var ControlGroup = require('./ControlGroup.jsx');
var ClassNames = require('classnames');


var View = React.createClass({
    render: function () {

        var inputClasses = ClassNames(ObjectAssign({
            'form-control': true
        }, this.props.inputClasses));

        return (
            <ControlGroup
                hasError={this.props.hasError}
                label={this.props.label}
                help={this.props.help}>

                <textarea
                    ref="inputField"
                    className={inputClasses}
                    name={this.props.name}
                    rows={this.props.rows}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    valueLink={this.props.valueLink}
                    disabled={this.props.disabled ? 'disabled' : undefined}
                    onChange={this.props.onChange}
                />
            </ControlGroup>
        );
    }
});


module.exports = View;
