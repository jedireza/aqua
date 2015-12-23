'use strict';
const React = require('react');


const propTypes = {
    type: React.PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
    onClose: React.PropTypes.func,
    message: React.PropTypes.string
};


class Alert extends React.Component {
    render() {

        let close;

        if (this.props.onClose) {
            close = <button
                type="button"
                className="close"
                onClick={this.props.onClose}>

                &times;
            </button>;
        }

        return (
            <div className={`alert alert-${this.props.type}`}>
                {close}
                {this.props.message}
            </div>
        );
    }
}

Alert.propTypes = propTypes;


module.exports = Alert;
