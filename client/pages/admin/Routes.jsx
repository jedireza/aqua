var React = require('react/addons');
var ReactRouter = require('react-router');
var App = require('./components/App');
var Home = require('./components/home/Controller');
var NotFound = require('./components/not-found/Controller');
var AccountSearch = require('./components/accounts/Search');
var AccountDetails = require('./components/accounts/Details');
var AdminSearch = require('./components/admins/Search');
var AdminDetails = require('./components/admins/Details');
var AdminGroupSearch = require('./components/admin-groups/Search');
var AdminGroupDetails = require('./components/admin-groups/Details');
var StatusSearch = require('./components/statuses/Search');
var StatusDetails = require('./components/statuses/Details');
var UserSearch = require('./components/users/Search');
var UserDetails = require('./components/users/Details');


var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;


var routes = (
    <Route path="/admin" name="app" handler={App}>
        <DefaultRoute name="home" handler={Home} />
        <NotFoundRoute name="notFound" handler={NotFound} />

        <Route path="accounts" name="accounts" handler={AccountSearch} />
        <Route path="accounts/:id" name="accountDetails" handler={AccountDetails} />
        <Route path="admins" name="admins" handler={AdminSearch} />
        <Route path="admins/:id" name="adminDetails" handler={AdminDetails} />
        <Route path="admin-groups" name="adminGroups" handler={AdminGroupSearch} />
        <Route path="admin-groups/:id" name="adminGroupDetails" handler={AdminGroupDetails} />
        <Route path="statuses" name="statuses" handler={StatusSearch} />
        <Route path="statuses/:id" name="statusDetails" handler={StatusDetails} />
        <Route path="users" name="users" handler={UserSearch} />
        <Route path="users/:id" name="userDetails" handler={UserDetails} />
    </Route>
);


module.exports = routes;
