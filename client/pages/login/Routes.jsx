var React = require('react/addons');
var ReactRouter = require('react-router');
var App = require('./components/App');
var Home = require('./components/Home');
var NotFound = require('./components/NotFound');
var Logout = require('./components/Logout');
var Forgot = require('./components/Forgot');
var Reset = require('./components/Reset');


var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;


var Routes = (
    <Route path="/login" name="app" handler={App}>
        <DefaultRoute name="home" handler={Home} />
        <NotFoundRoute name="notFound" handler={NotFound} />

        <Route path="forgot" name="forgot" handler={Forgot} />
        <Route path="reset/:email/:key" name="reset" handler={Reset} />
        <Route path="logout" name="logout" handler={Logout} />
    </Route>
);


module.exports = Routes;
