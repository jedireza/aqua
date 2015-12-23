var React = require('react');
var ReactRouter = require('react-router');
var CreateBrowserHistory = require('history/lib/createBrowserHistory');
var App = require('./components/App.jsx');
var Home = require('./components/home/Controller.jsx');
var NotFound = require('./components/not-found/Controller.jsx');
var Settings = require('./components/settings/Controller.jsx');


var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var History = CreateBrowserHistory();


var Routes = (
    <Router history={History}>
        <Route path="/account" component={App}>
            <IndexRoute component={Home} />
            <Route path="settings" component={Settings} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);


module.exports = Routes;
