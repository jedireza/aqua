/* global document, window */
'use strict';
const ClassNames = require('classnames');
const React = require('react');


const propTypes = {
    children: React.PropTypes.node,
    footer: React.PropTypes.node,
    header: React.PropTypes.node,
    onClose: React.PropTypes.func,
    show: React.PropTypes.bool
};


class Modal extends React.Component {
    constructor(props) {

        super(props);

        this.els = {};
        this.state = {
            bgHeight: window.innerHeight
        };
        this.boundWindowResize = this.onWindowResize.bind(this);
        this.boundKeyUp = this.onKeyUp.bind(this);
    }

    componentDidMount() {

        window.addEventListener('resize', this.boundWindowResize);
    }

    componentWillUnmount() {

        window.removeEventListener('resize', this.boundWindowResize);
        document.removeEventListener('keyup', this.boundKeyUp);
        document.body.classList.remove('modal-open');
    }

    componentWillUpdate(nextProps, nextState) {

        if (nextProps.show) {
            document.addEventListener('keyup', this.boundKeyUp);
            document.body.classList.add('modal-open');
        }
        else {
            document.removeEventListener('keyup', this.boundKeyUp);
            document.body.classList.remove('modal-open');
        }
    }

    onWindowResize() {

        this.setState({ bgHeight: window.innerHeight });
    }

    onBackdropClick(event) {

        if (event.target === event.currentTarget) {
            this.props.onClose();
        }
    }

    onKeyUp(event) {

        if (event.which === 27) {
            this.props.onClose();
        }
    }

    render() {

        const modalClasses = ClassNames({
            modal: true
        });
        const modalStyles = {};

        if (this.props.show) {
            modalStyles.display = 'block';
        }

        const modalBgStyles = {
            height: this.state.bgHeight + 'px',
            top: '0px'
        };
        const containerStyles = { display: 'none' };

        if (this.props.show) {
            containerStyles.display = 'block';
        }

        let modalHeader;

        if (this.props.header) {
            modalHeader = <div className="modal-header">
                <button type="button" className="close" onClick={this.props.onClose}>
                    &times;
                </button>
                <h4 className="modal-title">{this.props.header}</h4>
            </div>;
        }

        let modalFooter;

        if (this.props.footer) {
            modalFooter = <div className="modal-footer">
                {this.props.footer}
            </div>;
        }

        return (
            <div style={containerStyles}>
                <div
                    ref={(c) => (this.els.backdrop = c)}
                    className="modal-backdrop in"
                    style={modalBgStyles}>
                </div>
                <div
                    ref={(c) => (this.els.modal = c)}
                    style={modalStyles}
                    className={modalClasses}
                    onClick={this.onBackdropClick.bind(this)}>

                    <div
                      ref={(c) => (this.els.dialog = c)}
                      className="modal-dialog">

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
}

Modal.propTypes = propTypes;


module.exports = Modal;
