var React = require('react/addons');
var ReactRouter = require('react-router');
var App = require('./components/App');
var Home = require('./components/home/Controller');
var NotFound = require('./components/not-found/Controller');
var Settings = require('./components/settings/Controller');


var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;


var routes = (
    <Route path="/account" name="app" handler={App}>
        <DefaultRoute name="home" handler={Home} />
        <NotFoundRoute name="notFound" handler={NotFound} />

        <Route path="settings" name="settings" handler={Settings} />
    </Route>
);


module.exports = routes;
