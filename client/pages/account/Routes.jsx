var React = require('react/addons');
var ReactRouter = require('react-router');
var App = require('./components/App.react');
var Home = require('./components/home/Controller.react');
var NotFound = require('./components/not-found/Controller.react');
var Settings = require('./components/settings/Controller.react');


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
