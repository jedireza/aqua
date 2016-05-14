var React = require('react');
var ReactRouter = require('react-router');
var Lab = require('lab');
var Code = require('code');
var App = require('../../../../../client/pages/admin/components/App.jsx');
var RouteHelpers = require('../../../fixtures/RouteHelpers');


var lab = exports.lab = Lab.script();
var TestUtils = require('react-addons-test-utils');
const { Route, IndexRedirect, Router } = ReactRouter;


var Routes = <Route name="app" path="/admin" handler={App}>
    <IndexRedirect to="/home" />
    <Route name="home" path="home" handler={RouteHelpers.StubHandler} />
    <Route name="accounts" path="accounts" handler={RouteHelpers.StubHandler} />
    <Route name="admins" path="admins" handler={RouteHelpers.StubHandler} />
    <Route name="adminGroups" path="admin-groups" handler={RouteHelpers.StubHandler} />
    <Route name="statuses" path="statuses" handler={RouteHelpers.StubHandler} />
    <Route name="users" path="users" handler={RouteHelpers.StubHandler} />
  </Route>;

lab.experiment('Admin App Component', function () {

    lab.test('it renders normally', function (done) {

        var mainElement = TestUtils.renderIntoDocument(<Router routes={Routes} />);

        Code.expect(mainElement).to.exist();
        done();
    });
});
