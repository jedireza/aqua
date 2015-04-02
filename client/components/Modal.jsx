/* global document, window */
var React = require('react/addons');
var ClassNames = require('classnames');


var Component = React.createClass({
    getInitialState: function () {

        return {
            bgHeight: window.innerHeight
        };
    },
    getDefaultProps: function () {

        return {
            data: {}
        };
    },
    componentDidMount: function () {

        window.addEventListener('resize', this.onWindowResize);
    },
    componentWillUnmount: function () {

        window.removeEventListener('resize', this.onWindowResize);
        document.removeEventListener('keyup', this.onKeyUp);
        document.body.classList.remove('modal-open');
    },
    componentWillUpdate: function (nextProps, nextState) {

        if (nextProps.show) {
            document.addEventListener('keyup', this.onKeyUp);
            document.body.classList.add('modal-open');
        }
        else {
            document.removeEventListener('keyup', this.onKeyUp);
            document.body.classList.remove('modal-open');
        }
    },
    onWindowResize: function () {

        this.setState({ bgHeight: window.innerHeight });
    },
    onBackdropClick: function (event) {

        if (event.target === event.currentTarget) {
            this.props.onClose();
        }
    },
    onKeyUp: function (event) {

        if (event.which === 27) {
            this.props.onClose();
        }
    },
    render: function () {

        var modalClasses = ClassNames({
            modal: true
        });

        var modalStyles = {};
        if (this.props.show) {
            modalStyles.display = 'block';
        }

        var modalBgStyles = {
            height: this.state.bgHeight + 'px',
            top: document.body.scrollTop + 'px'
        };

        var containerStyles = { display: 'none' };
        if (this.props.show) {
            containerStyles.display = 'block';
        }

        var modalHeader;
        if (this.props.header) {
            modalHeader = <div className="modal-header">
                <button type="button" className="close" onClick={this.props.onClose}>
                    &times;
                </button>
                <h4 className="modal-title">{this.props.header}</h4>
            </div>;
        }

        var modalFooter;
        if (this.props.footer) {
            modalFooter = <div className="modal-footer">
                {this.props.footer}
            </div>;
        }

        return (
            <div style={containerStyles}>
                <div
                    ref="backdrop"
                    className="modal-backdrop in"
                    style={modalBgStyles}>
                </div>
                <div
                    ref="modal"
                    style={modalStyles}
                    className={modalClasses}
                    onClick={this.onBackdropClick}>

                    <div ref="dialog" className="modal-dialog">
                        <div className="modal-content">
                            {modalHeader}
                            <div className="modal-body">
                                {this.props.children}
                            </div>
                            {modalFooter}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = Component;
