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
    LoginStore: {}
};
var Home = Proxyquire('../../../../../client/pages/login/components/Home', {
    '../Actions': stub.Actions,
    '../stores/Login': stub.LoginStore
});


lab.experiment('Login Home Form', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(Home, {});
        var HomeEl = React.createElement(ComponentWithContext, {});
        var home = TestUtils.renderIntoDocument(HomeEl);

        Code.expect(home).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentWithContext = StubRouterContext(Home, {});
        var HomeEl = React.createElement(ComponentWithContext, {});

        React.render(HomeEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var ComponentWithContext = StubRouterContext(Home, {});
        var HomeEl = React.createElement(ComponentWithContext, {});

        TestUtils.renderIntoDocument(HomeEl);
        stub.LoginStore.emitChange();

        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.login = function () {

            done();
        };

        var ComponentWithContext = StubRouterContext(Home, {});
        var HomeEl = React.createElement(ComponentWithContext, {});
        var home = TestUtils.renderIntoDocument(HomeEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(home, 'form');

        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it renders with loading state', function (done) {

        var ComponentWithContext = StubRouterContext(Home, {});
        var HomeEl = React.createElement(ComponentWithContext, {});
        var home = TestUtils.renderIntoDocument(HomeEl);
        var button = TestUtils.findRenderedDOMComponentWithTag(home, 'button');

        stub.LoginStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.LOGIN
            }
        });

        Code.expect(button.getDOMNode().disabled).to.be.true();
        done();
    });


    lab.test('it renders with success state', function (done) {

        var ComponentWithContext = StubRouterContext(Home, {});
        var HomeEl = React.createElement(ComponentWithContext, {});
        var home = TestUtils.renderIntoDocument(HomeEl);

        stub.LoginStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.LOGIN_RESPONSE,
                data: {
                    success: true
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(home, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var ComponentWithContext = StubRouterContext(Home, {});
        var HomeEl = React.createElement(ComponentWithContext, {});
        var home = TestUtils.renderIntoDocument(HomeEl);

        stub.LoginStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.LOGIN_RESPONSE,
                data: {
                    message: 'an error occurred and stuff'
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(home, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
