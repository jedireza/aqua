'use strict';
const AccountDetails = require('./accounts/details/index.jsx');
const AccountSearch = require('./accounts/search/index.jsx');
const AdminDetails = require('./admins/details/index.jsx');
const AdminGroupDetails = require('./admin-groups/details/index.jsx');
const AdminGroupSearch = require('./admin-groups/search/index.jsx');
const AdminSearch = require('./admins/search/index.jsx');
const Footer = require('./footer.jsx');
const Home = require('./home/index.jsx');
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
                <Route path="/admin" exact component={Home} />
                <Route path="/admin/accounts" exact component={AccountSearch} />
                <Route path="/admin/accounts/:id" component={AccountDetails} />
                <Route path="/admin/admins" exact component={AdminSearch} />
                <Route path="/admin/admins/:id" component={AdminDetails} />
                <Route path="/admin/admin-groups" exact component={AdminGroupSearch} />
                <Route path="/admin/admin-groups/:id" component={AdminGroupDetails} />
                <Route path="/admin/statuses" exact component={StatusSearch} />
                <Route path="/admin/statuses/:id" component={StatusDetails} />
                <Route path="/admin/users" exact component={UserSearch} />
                <Route path="/admin/users/:id" component={UserDetails} />

                <Route component={NotFound} />
            </Switch>
            <Footer />
        </div>
    </Router>
);


module.exports = App;
