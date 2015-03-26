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
    ForgotStore: {}
};
var Forgot = Proxyquire('../../../../../client/pages/login/components/Forgot', {
    '../Actions': stub.Actions,
    '../stores/Forgot': stub.ForgotStore
});


lab.experiment('Login Forgot Form', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(Forgot, {});
        var ForgotEl = React.createElement(ComponentWithContext, {});
        var forgot = TestUtils.renderIntoDocument(ForgotEl);

        Code.expect(forgot).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentWithContext = StubRouterContext(Forgot, {});
        var ForgotEl = React.createElement(ComponentWithContext, {});

        React.render(ForgotEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var ComponentWithContext = StubRouterContext(Forgot, {});
        var ForgotEl = React.createElement(ComponentWithContext, {});

        TestUtils.renderIntoDocument(ForgotEl);
        stub.ForgotStore.emitChange();

        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.forgot = function () {

            done();
        };

        var ComponentWithContext = StubRouterContext(Forgot, {});
        var ForgotEl = React.createElement(ComponentWithContext, {});
        var forgot = TestUtils.renderIntoDocument(ForgotEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(forgot, 'form');

        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it renders with loading state', function (done) {

        var ComponentWithContext = StubRouterContext(Forgot, {});
        var ForgotEl = React.createElement(ComponentWithContext, {});
        var forgot = TestUtils.renderIntoDocument(ForgotEl);
        var button = TestUtils.findRenderedDOMComponentWithTag(forgot, 'button');

        stub.ForgotStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.FORGOT
            }
        });

        Code.expect(button.getDOMNode().disabled).to.be.true();
        done();
    });


    lab.test('it renders with success state', function (done) {

        var ComponentWithContext = StubRouterContext(Forgot, {});
        var ForgotEl = React.createElement(ComponentWithContext, {});
        var forgot = TestUtils.renderIntoDocument(ForgotEl);

        stub.ForgotStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.FORGOT_RESPONSE,
                data: {
                    success: true
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(forgot, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var ComponentWithContext = StubRouterContext(Forgot, {});
        var ForgotEl = React.createElement(ComponentWithContext, {});
        var forgot = TestUtils.renderIntoDocument(ForgotEl);

        stub.ForgotStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.FORGOT_RESPONSE,
                data: {
                    message: 'an error occurred and stuff'
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(forgot, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
