var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var Constants = require('../../../../client/pages/signup/Constants');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {},
    Store: {}
};
var Form = Proxyquire('../../../../client/pages/signup/Form', {
    './Actions': stub.Actions,
    './Store': stub.Store
});


lab.experiment('Sign Up Form', function () {

    lab.test('it renders normally', function (done) {

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var FormEl = React.createElement(Form, {});

        React.render(FormEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);

        stub.Store.emitChange();

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.sendRequest = function () {

            done();
        };

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it renders with loading state', function (done) {

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);

        stub.Store.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.SEND_REQUEST
            }
        });

        var button = TestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.getDOMNode().disabled).to.be.true();
        done();
    });


    lab.test('it renders with success state', function (done) {

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);

        stub.Store.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.RECEIVE_RESPONSE,
                data: {
                    success: true
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);

        stub.Store.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.RECEIVE_RESPONSE,
                data: {
                    message: 'an error occurred and stuff'
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
