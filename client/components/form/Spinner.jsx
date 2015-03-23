var React = require('react/addons');
var ClassNames = require('classnames');


var View = React.createClass({
    render: function () {

        var spaceLeft;
        if (this.props.space === 'left') {
            spaceLeft = '\u00A0\u00A0';
        }

        var spaceRight;
        if (this.props.space === 'right') {
            spaceRight = '\u00A0\u00A0';
        }

        var spinnerClasses = ClassNames({
            hidden: !this.props.show
        });

        return (
            <span className={spinnerClasses}>
                {spaceLeft}
                <i className="fa fa-refresh fa-spin"></i>
                {spaceRight}
            </span>
        );
    }
});


module.exports = View;
