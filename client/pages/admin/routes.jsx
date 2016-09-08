'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const App = require('./app.jsx');
const Home = require('./home.jsx');
const NotFound = require('./not-found.jsx');
const AccountSearch = require('./accounts/search/index.jsx');
const AccountDetails = require('./accounts/details/index.jsx');
const AdminSearch = require('./admins/search/index.jsx');
const AdminDetails = require('./admins/details/index.jsx');
const AdminGroupSearch = require('./admin-groups/search/index.jsx');
const AdminGroupDetails = require('./admin-groups/details/index.jsx');
const StatusSearch = require('./statuses/search/index.jsx');
const StatusDetails = require('./statuses/details/index.jsx');
const UserSearch = require('./users/search/index.jsx');
const UserDetails = require('./users/details/index.jsx');


const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;


const Routes = (
    <Router history={ReactRouter.browserHistory}>
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
        <Route path="*" component={NotFound} />
    </Router>
);


module.exports = Routes;
