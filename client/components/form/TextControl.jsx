var React = require('react/addons');
var ObjectAssign = require('object-assign');
var ControlGroup = require('../../components/form/ControlGroup');
var ClassNames = require('classnames');


var View = React.createClass({
    getDefaultProps: function () {

        return {
            type: 'text',
            autoCapitalize: 'off'
        };
    },
    render: function () {

        var inputClasses = ClassNames(ObjectAssign({
            'form-control': true
        }, this.props.inputClasses));

        return (
            <ControlGroup
                hasError={this.props.hasError}
                label={this.props.label}
                help={this.props.help}>

                <input
                    ref="inputField"
                    type={this.props.type}
                    autoCapitalize={this.props.autoCapitalize}
                    className={inputClasses}
                    name={this.props.name}
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
