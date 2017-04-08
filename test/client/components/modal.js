'use strict';
const Code = require('code');
const Lab = require('lab');
const Modal = require('../../../client/components/modal.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Modal', () => {

    lab.test('it renders', (done) => {

        const ModalEl = React.createElement(Modal, {});
        const modal = ReactTestUtils.renderIntoDocument(ModalEl);

        Code.expect(modal).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const ModalEl = React.createElement(Modal, {});

        ReactDOM.render(ModalEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it updates props to show/hide (for keyup listener and body class)', (done) => {

        const container = document.createElement('div');

        // initial render
        let ModalEl = React.createElement(Modal, {});
        ReactDOM.render(ModalEl, container);

        // update props and render again
        ModalEl = React.createElement(Modal, { show: true });
        ReactDOM.render(ModalEl, container);

        // update props and render again
        ModalEl = React.createElement(Modal, { show: false });
        ReactDOM.render(ModalEl, container);

        done();
    });


    lab.test('it handles window resizing', (done) => {

        const ModalEl = React.createElement(Modal, {});
        const modal = ReactTestUtils.renderIntoDocument(ModalEl);

        modal.onWindowResize();

        done();
    });


    lab.test('it closes when the backdrop is clicked through modal, but not when clicking on the dialog', (done) => {

        const props = {
            onClose: function () {

                done();
            }
        };
        const ModalEl = React.createElement(Modal, props);
        const modal = ReactTestUtils.renderIntoDocument(ModalEl);

        // click on the dialog
        ReactTestUtils.Simulate.click(modal.els.dialog);

        // then click on the modal
        ReactTestUtils.Simulate.click(modal.els.modal);
    });


    lab.test('it closes when the esc key is pressed, but not another key', (done) => {

        const props = {
            onClose: function () {

                done();
            }
        };
        const ModalEl = React.createElement(Modal, props);
        const modal = ReactTestUtils.renderIntoDocument(ModalEl);

        modal.onKeyUp({ which: 26 });
        modal.onKeyUp({ which: 27 });
    });


    lab.test('it renders with a header', (done) => {

        const props = {
            header: 'Mega modal'
        };
        const ModalEl = React.createElement(Modal, props);

        ReactTestUtils.renderIntoDocument(ModalEl);

        done();
    });


    lab.test('it renders with a footer', (done) => {

        const props = {
            footer: 'Close'
        };
        const ModalEl = React.createElement(Modal, props);

        ReactTestUtils.renderIntoDocument(ModalEl);

        done();
    });
});
