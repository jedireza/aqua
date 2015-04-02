var React = require('react/addons');
var ReactRouter = require('react-router');
var Lab = require('lab');
var Code = require('code');
var App = require('../../../../../client/pages/account/components/App');
var RouteHelpers = require('../../../fixtures/RouteHelpers');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var Routes = React.createElement(Route,
    { path: '/account', name: 'app', handler: App },
    React.createElement(DefaultRoute, {
        name: 'home', handler: RouteHelpers.StubHandler
    }),
    React.createElement(Route, {
        path: 'settings', name: 'settings', handler: RouteHelpers.StubHandler
    })
);


lab.experiment('Account App Component', function () {

    lab.test('it renders normally', function (done) {

        ReactRouter.run(Routes, '/account', function (Handler) {

            var HandlerEl = React.createElement(Handler, {});
            var mainElement = TestUtils.renderIntoDocument(HandlerEl);

            Code.expect(mainElement).to.exist();
            done();
        });
    });
});
