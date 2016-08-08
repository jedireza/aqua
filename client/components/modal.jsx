/* global document, window */
'use strict';
const React = require('react');
const ClassNames = require('classnames');


class Component extends React.Component {
    getInitialState () {

        return {
            bgHeight: window.innerHeight
        };
    }

    getDefaultProps () {

        return {
            data: {}
        };
    }

    componentDidMount () {

        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount () {

        window.removeEventListener('resize', this.onWindowResize);
        document.removeEventListener('keyup', this.onKeyUp);
        document.body.classList.remove('modal-open');
    }

    componentWillUpdate (nextProps, nextState) {

        if (nextProps.show) {
            document.addEventListener('keyup', this.onKeyUp);
            document.body.classList.add('modal-open');
        }
        else {
            document.removeEventListener('keyup', this.onKeyUp);
            document.body.classList.remove('modal-open');
        }
    }

    onWindowResize () {

        this.setState({ bgHeight: window.innerHeight });
    }

    onBackdropClick (event) {

        if (event.target === event.currentTarget) {
            this.props.onClose();
        }
    }

    onKeyUp (event) {

        if (event.which === 27) {
            this.props.onClose();
        }
    }

    render () {

        const modalClasses = ClassNames({
            modal: true
        });

        const modalStyles = {};
        if (this.props.show) {
            modalStyles.display = 'block';
        }

        const modalBgStyles = {
            height: this.state.bgHeight + 'px',
            top: document.body.scrollTop + 'px'
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
}


module.exports = Component;
