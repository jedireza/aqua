'use strict';
const About = require('./about/index.jsx');
const Contact = require('./contact/index.jsx');
const Footer = require('./footer.jsx');
const Home = require('./home/index.jsx');
const Login = require('./login/home/index.jsx');
const LoginForgot = require('./login/forgot/index.jsx');
const LoginLogout = require('./login/logout/index.jsx');
const LoginReset = require('./login/reset/index.jsx');
const Navbar = require('./navbar.jsx');
const NotFound = require('./not-found.jsx');
const React = require('react');
const ReactRouter = require('react-router-dom');
const RouteRedirect = require('../../components/route-redirect.jsx');
const Signup = require('./signup/index.jsx');


const Route = ReactRouter.Route;
const Switch = ReactRouter.Switch;


const AppUniversal = function () {

    return (
        <div>
            <Route component={Navbar} />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/about" exact component={About} />
                <Route path="/contact" exact component={Contact} />
                <Route path="/login" exact component={Login} />
                <Route path="/login/forgot" exact component={LoginForgot} />
                <Route path="/login/reset/:email/:key" component={LoginReset} />
                <Route path="/login/logout" exact component={LoginLogout} />
                <Route path="/signup" exact component={Signup} />

                <RouteRedirect from="/moved" to="/" code={301} />

                <Route component={NotFound} />
            </Switch>
            <Footer />
        </div>
    );
};


module.exports = AppUniversal;
