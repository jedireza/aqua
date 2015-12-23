var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var ReactRouter = require('react-router');
var CreateMemoryHistory = require('history').createMemoryHistory;
var Lab = require('lab');
var Code = require('code');
var App = require('../../../../../client/pages/account/components/App.jsx');
var RouteHelpers = require('../../../fixtures/RouteHelpers');


var lab = exports.lab = Lab.script();
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Routes = React.createElement(Router,
    { history: CreateMemoryHistory('/account') },
    React.createElement(Router, {
        path: '/account', component: App
    })
);


lab.experiment('Account App Component', function () {

    lab.test('it renders normally', function (done) {

        var mainElement = TestUtils.renderIntoDocument(Routes);
        Code.expect(mainElement).to.exist();
        done();
    });
});
