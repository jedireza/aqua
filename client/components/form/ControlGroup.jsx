var React = require('react/addons');
var ObjectAssign = require('object-assign');


var classSet = React.addons.classSet;


var View = React.createClass({
    render: function () {

        var groupClasses = classSet(ObjectAssign({
            'form-group': true,
            'has-error': this.props.hasError
        }, this.props.groupClasses));

        var labelClasses = classSet(ObjectAssign({
            'control-label': true
        }, this.props.labelClasses));

        var helpClasses = classSet(ObjectAssign({
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
