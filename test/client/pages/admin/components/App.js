var React = require('react/addons');
var ReactRouter = require('react-router');
var Lab = require('lab');
var Code = require('code');
var App = require('../../../../../client/pages/admin/components/App');
var RouteHelpers = require('../../../fixtures/RouteHelpers');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var Routes = React.createElement(Route,
    { path: '/admin', name: 'app', handler: App },
    React.createElement(DefaultRoute, {
        name: 'home', handler: RouteHelpers.StubHandler
    }),
    React.createElement(Route, {
        path: 'accounts', name: 'accounts', handler: RouteHelpers.StubHandler
    }),
    React.createElement(Route, {
        path: 'admins', name: 'admins', handler: RouteHelpers.StubHandler
    }),
    React.createElement(Route, {
        path: 'admin-groups', name: 'adminGroups', handler: RouteHelpers.StubHandler
    }),
    React.createElement(Route, {
        path: 'statuses', name: 'statuses', handler: RouteHelpers.StubHandler
    }),
    React.createElement(Route, {
        path: 'users', name: 'users', handler: RouteHelpers.StubHandler
    })
);


lab.experiment('Admin App Component', function () {

    lab.test('it renders normally', function (done) {

        ReactRouter.run(Routes, '/admin', function (Handler) {

            var HandlerEl = React.createElement(Handler, {});
            var mainElement = TestUtils.renderIntoDocument(HandlerEl);

            Code.expect(mainElement).to.exist();
            done();
        });
    });
});
