var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var StubRouterContext = require('../../../fixtures/StubRouterContext');
var Constants = require('../../../../../client/pages/login/Constants');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {},
    ResetStore: {}
};
var Reset = Proxyquire('../../../../../client/pages/login/components/Reset', {
    '../Actions': stub.Actions,
    '../stores/Reset': stub.ResetStore
});
var RouterStubs = {
    getCurrentParams: function () {

        return {};
    }
};


lab.experiment('Login Reset Form', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(Reset, RouterStubs);
        var ResetEl = React.createElement(ComponentWithContext, {});
        var reset = TestUtils.renderIntoDocument(ResetEl);

        Code.expect(reset).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentWithContext = StubRouterContext(Reset, RouterStubs);
        var ResetEl = React.createElement(ComponentWithContext, {});

        React.render(ResetEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var ComponentWithContext = StubRouterContext(Reset, RouterStubs);
        var ResetEl = React.createElement(ComponentWithContext, {});

        TestUtils.renderIntoDocument(ResetEl);
        stub.ResetStore.emitChange();

        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.reset = function () {

            done();
        };

        var ComponentWithContext = StubRouterContext(Reset, RouterStubs);
        var ResetEl = React.createElement(ComponentWithContext, {});
        var reset = TestUtils.renderIntoDocument(ResetEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(reset, 'form');

        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it renders with loading state', function (done) {

        var ComponentWithContext = StubRouterContext(Reset, RouterStubs);
        var ResetEl = React.createElement(ComponentWithContext, {});
        var reset = TestUtils.renderIntoDocument(ResetEl);
        var button = TestUtils.findRenderedDOMComponentWithTag(reset, 'button');

        stub.ResetStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.RESET
            }
        });

        Code.expect(button.getDOMNode().disabled).to.be.true();
        done();
    });


    lab.test('it renders with success state', function (done) {

        var ComponentWithContext = StubRouterContext(Reset, RouterStubs);
        var ResetEl = React.createElement(ComponentWithContext, {});
        var reset = TestUtils.renderIntoDocument(ResetEl);

        stub.ResetStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.RESET_RESPONSE,
                data: {
                    success: true
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(reset, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var ComponentWithContext = StubRouterContext(Reset, RouterStubs);
        var ResetEl = React.createElement(ComponentWithContext, {});
        var reset = TestUtils.renderIntoDocument(ResetEl);

        stub.ResetStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.RESET_RESPONSE,
                data: {
                    message: 'an error occurred and stuff'
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(reset, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
