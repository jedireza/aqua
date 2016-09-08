'use strict';
const ClassNames = require('classnames');
const React = require('react');


const propTypes = {
    space: React.PropTypes.string,
    show: React.PropTypes.bool
};


class Spinner extends React.Component {
    render() {

        let spaceLeft;

        if (this.props.space === 'left') {
            spaceLeft = '\u00A0\u00A0';
        }

        let spaceRight;

        if (this.props.space === 'right') {
            spaceRight = '\u00A0\u00A0';
        }

        const spinnerClasses = ClassNames({
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
}

Spinner.propTypes = propTypes;


module.exports = Spinner;
