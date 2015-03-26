var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var StubRouterContext = require('../../../fixtures/StubRouterContext');
var Constants = require('../../../../../client/pages/login/Constants');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {
        logout: function () {}
    },
    LogoutStore: {}
};
var Logout = Proxyquire('../../../../../client/pages/login/components/Logout', {
    '../Actions': stub.Actions,
    '../stores/Logout': stub.LogoutStore
});


lab.experiment('Login Logout Form', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(Logout, {});
        var LogoutEl = React.createElement(ComponentWithContext, {});
        var logout = TestUtils.renderIntoDocument(LogoutEl);

        Code.expect(logout).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentWithContext = StubRouterContext(Logout, {});
        var LogoutEl = React.createElement(ComponentWithContext, {});

        React.render(LogoutEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var ComponentWithContext = StubRouterContext(Logout, {});
        var LogoutEl = React.createElement(ComponentWithContext, {});

        TestUtils.renderIntoDocument(LogoutEl);
        stub.LogoutStore.emitChange();

        done();
    });


    lab.test('it renders with success state', function (done) {

        var ComponentWithContext = StubRouterContext(Logout, {});
        var LogoutEl = React.createElement(ComponentWithContext, {});
        var logout = TestUtils.renderIntoDocument(LogoutEl);

        stub.LogoutStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.LOGOUT_RESPONSE,
                data: {
                    success: true
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(logout, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var ComponentWithContext = StubRouterContext(Logout, {});
        var LogoutEl = React.createElement(ComponentWithContext, {});
        var logout = TestUtils.renderIntoDocument(LogoutEl);

        stub.LogoutStore.onDispatcherAction({
            action: {
                type: Constants.ActionTypes.LOGOUT_RESPONSE,
                data: {
                    message: 'an error occurred and stuff'
                }
            }
        });

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(logout, 'alert-warning');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
