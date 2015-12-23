var React = require('react');
var ReactRouter = require('react-router');
var CreateBrowserHistory = require('history/lib/createBrowserHistory');
var Home = require('./components/Home.jsx');
var NotFound = require('./components/NotFound.jsx');
var Logout = require('./components/Logout.jsx');
var Forgot = require('./components/Forgot.jsx');
var Reset = require('./components/Reset.jsx');


var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var History = CreateBrowserHistory();


var Routes = (
    <Router history={History}>
        <Route path="/login" component={Home} />
        <Route path="/login/forgot" component={Forgot} />
        <Route path="/login/reset/:email/:key" component={Reset} />
        <Route path="/login/logout" component={Logout} />
        <Route path="*" component={NotFound} />
    </Router>
);


module.exports = Routes;
