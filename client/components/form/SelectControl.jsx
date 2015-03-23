var React = require('react/addons');
var ObjectAssign = require('object-assign');
var ControlGroup = require('../../components/form/ControlGroup');
var ClassNames = require('classnames');


var View = React.createClass({
    getDefaultProps: function () {

        return {
            type: 'text'
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

                <select
                    ref="selectField"
                    multiple={this.props.multiple}
                    className={inputClasses}
                    name={this.props.name}
                    size={this.props.size}
                    value={this.props.value}
                    valueLink={this.props.valueLink}
                    defaultValue={this.props.defaultValue}
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}>

                    {this.props.children}
                </select>
            </ControlGroup>
        );
    }
});


module.exports = View;
