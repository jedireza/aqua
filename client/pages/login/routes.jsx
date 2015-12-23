'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const Home = require('./components/home');
const NotFound = require('./components/not-found');
const Logout = require('./components/logout');
const Forgot = require('./components/forgot');
const Reset = require('./components/reset');


const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;


const Routes = (
    <Router history={ReactRouter.browserHistory}>
        <Route path="/login" component={Home} />
        <Route path="/login/forgot" component={Forgot} />
        <Route path="/login/reset/:email/:key" component={Reset} />
        <Route path="/login/logout" component={Logout} />
        <Route path="*" component={NotFound} />
    </Router>
);


module.exports = Routes;
