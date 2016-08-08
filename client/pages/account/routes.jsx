'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const App = require('./components/app');
const Home = require('./components/home/controller');
const NotFound = require('./components/not-found/controller');
const Settings = require('./components/settings/controller');


const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;


const Routes = (
    <Router history={ReactRouter.browserHistory}>
        <Route path="/account" component={App}>
            <IndexRoute component={Home} />
            <Route path="settings" component={Settings} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);


module.exports = Routes;
