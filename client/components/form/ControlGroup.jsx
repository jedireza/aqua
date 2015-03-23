var React = require('react/addons');
var ObjectAssign = require('object-assign');
var ClassNames = require('classnames');


var View = React.createClass({
    render: function () {

        var groupClasses = ClassNames(ObjectAssign({
            'form-group': true,
            'has-error': this.props.hasError
        }, this.props.groupClasses));

        var labelClasses = ClassNames(ObjectAssign({
            'control-label': true
        }, this.props.labelClasses));

        var helpClasses = ClassNames(ObjectAssign({
            'help-block': true
        }, this.props.helpClasses));

        var labelComponent;
        if (!this.props.hideLabel) {
            labelComponent = <label className={labelClasses}>
                {this.props.label}
            </label>;
        }

        var helpComponent;
        if (!this.props.hideHelp) {
            helpComponent = <span className={helpClasses}>
                {this.props.help}
            </span>;
        }

        return (
            <div className={groupClasses}>
                {labelComponent}
                {this.props.children}
                {helpComponent}
            </div>
        );
    }
});


module.exports = View;
