'use strict';
const AccountDetails = require('./accounts/details/index.jsx');
const AccountSearch = require('./accounts/search/index.jsx');
const AdminDetails = require('./admins/details/index.jsx');
const AdminGroupDetails = require('./admin-groups/details/index.jsx');
const AdminGroupSearch = require('./admin-groups/search/index.jsx');
const AdminSearch = require('./admins/search/index.jsx');
const Footer = require('./footer.jsx');
const Home = require('./home.jsx');
const Navbar = require('./navbar.jsx');
const NotFound = require('./not-found.jsx');
const React = require('react');
const ReactRouter = require('react-router-dom');
const StatusDetails = require('./statuses/details/index.jsx');
const StatusSearch = require('./statuses/search/index.jsx');
const UserDetails = require('./users/details/index.jsx');
const UserSearch = require('./users/search/index.jsx');


const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Switch = ReactRouter.Switch;


const App = (
    <Router>
        <div>
            <Route component={Navbar} />
            <Switch>
                <Route exact path="/admin" component={Home} />
                <Route exact path="/admin/accounts" component={AccountSearch} />
                <Route path="/admin/accounts/:id" component={AccountDetails} />
                <Route exact path="/admin/admins" component={AdminSearch} />
                <Route path="/admin/admins/:id" component={AdminDetails} />
                <Route exact path="/admin/admin-groups" component={AdminGroupSearch} />
                <Route path="/admin/admin-groups/:id" component={AdminGroupDetails} />
                <Route exact path="/admin/statuses" component={StatusSearch} />
                <Route path="/admin/statuses/:id" component={StatusDetails} />
                <Route exact path="/admin/users" component={UserSearch} />
                <Route path="/admin/users/:id" component={UserDetails} />
                <Route component={NotFound} />
            </Switch>
            <Footer />
        </div>
    </Router>
);


module.exports = App;
