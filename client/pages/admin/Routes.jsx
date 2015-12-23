var React = require('react');
var ReactRouter = require('react-router');
var CreateBrowserHistory = require('history/lib/createBrowserHistory');
var App = require('./components/App.jsx');
var Home = require('./components/home/Controller.jsx');
var NotFound = require('./components/not-found/Controller.jsx');
var AccountSearch = require('./components/accounts/Search.jsx');
var AccountDetails = require('./components/accounts/Details.jsx');
var AdminSearch = require('./components/admins/Search.jsx');
var AdminDetails = require('./components/admins/Details.jsx');
var AdminGroupSearch = require('./components/admin-groups/Search.jsx');
var AdminGroupDetails = require('./components/admin-groups/Details.jsx');
var StatusSearch = require('./components/statuses/Search.jsx');
var StatusDetails = require('./components/statuses/Details.jsx');
var UserSearch = require('./components/users/Search.jsx');
var UserDetails = require('./components/users/Details.jsx');


var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var History = CreateBrowserHistory();


var Routes = (
    <Router history={History}>
        <Route path="/admin" component={App}>
            <IndexRoute component={Home} />
            <Route path="accounts" component={AccountSearch} />
            <Route path="accounts/:id" component={AccountDetails} />
            <Route path="admins" component={AdminSearch} />
            <Route path="admins/:id" component={AdminDetails} />
            <Route path="admin-groups" component={AdminGroupSearch} />
            <Route path="admin-groups/:id" component={AdminGroupDetails} />
            <Route path="statuses" component={StatusSearch} />
            <Route path="statuses/:id" component={StatusDetails} />
            <Route path="users" component={UserSearch} />
            <Route path="users/:id" component={UserDetails} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);


module.exports = Routes;
