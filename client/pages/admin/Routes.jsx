var React = require('react/addons');
var ReactRouter = require('react-router');
var App = require('./components/App.react');
var Home = require('./components/home/Controller.react');
var NotFound = require('./components/not-found/Controller.react');
var AccountSearch = require('./components/accounts/Search.react');
var AccountDetails = require('./components/accounts/Details.react');
var AdminSearch = require('./components/admins/Search.react');
var AdminDetails = require('./components/admins/Details.react');
var AdminGroupSearch = require('./components/admin-groups/Search.react');
var AdminGroupDetails = require('./components/admin-groups/Details.react');
var StatusSearch = require('./components/statuses/Search.react');
var StatusDetails = require('./components/statuses/Details.react');
var UserSearch = require('./components/users/Search.react');
var UserDetails = require('./components/users/Details.react');


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
