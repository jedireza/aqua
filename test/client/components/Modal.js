var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Modal = require('../../../client/components/Modal');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


lab.experiment('Modal', function () {

    lab.test('it renders normally', function (done) {

        var ModalEl = React.createElement(Modal, {});
        var modal = TestUtils.renderIntoDocument(ModalEl);

        Code.expect(modal).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ModalEl = React.createElement(Modal, {});

        React.render(ModalEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it updates props to show (for key listener and body class)', function (done) {

        var ModalEl = React.createElement(Modal, {});
        var modal = TestUtils.renderIntoDocument(ModalEl);

        modal.setProps({ show: true });

        done();
    });


    lab.test('it updates props to hide (for key listener and body class)', function (done) {

        var ModalEl = React.createElement(Modal, {});
        var modal = TestUtils.renderIntoDocument(ModalEl);

        modal.setProps({ show: false });

        done();
    });


    lab.test('it handles window resizing', function (done) {

        var ModalEl = React.createElement(Modal, {});
        var modal = TestUtils.renderIntoDocument(ModalEl);

        modal.onWindowResize();

        done();
    });


    lab.test('it closes when the backdrop is clicked through modal, but not when clicking on the dialog', function (done) {

        var props = {
            onClose: function () {

                done();
            }
        };
        var ModalEl = React.createElement(Modal, props);
        var modal = TestUtils.renderIntoDocument(ModalEl);

        // click on the dialog
        TestUtils.Simulate.click(modal.refs.dialog.getDOMNode());

        // click on the modal
        TestUtils.Simulate.click(modal.refs.modal.getDOMNode());
    });


    lab.test('it closes when the esc key is pressed, but not another key', function (done) {

        var props = {
            onClose: function () {

                done();
            }
        };
        var ModalEl = React.createElement(Modal, props);
        var modal = TestUtils.renderIntoDocument(ModalEl);

        modal.onKeyUp({ which: 26 });
        modal.onKeyUp({ which: 27 });
    });


    lab.test('it renders with a header', function (done) {

        var props = {
            header: 'Mega modal'
        };
        var ModalEl = React.createElement(Modal, props);

        TestUtils.renderIntoDocument(ModalEl);
        done();
    });


    lab.test('it renders with a footer', function (done) {

        var props = {
            footer: 'Close'
        };
        var ModalEl = React.createElement(Modal, props);

        TestUtils.renderIntoDocument(ModalEl);
        done();
    });
});
