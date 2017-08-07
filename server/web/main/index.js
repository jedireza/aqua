'use strict';
const React = require('react');
const ReactDomServer = require('react-dom/server');
const ReactHelmet = require('react-helmet');
const ReactRouter = require('react-router-dom');


const internals = {};
const StaticRouter = ReactRouter.StaticRouter;


internals.routeHandler = function (request, reply) {

    const routerState = {};
    const routerProps = {
        location: request.url.path,
        context: routerState
    };
    const AppUniversal = require('../../../client/pages/main/app-universal.jsx');
    const AppEl = React.createElement(AppUniversal);
    const App = React.createElement(StaticRouter, routerProps, AppEl);
    const markup = ReactDomServer.renderToString(App);
    const helmet = ReactHelmet.Helmet.renderStatic(); // leaks if not called after render

    if (routerState.url) {
        return reply().redirect(routerState.url).code(routerState.code);
    }

    const response = reply.view('main/index', {
        helmet,
        markup,
        state: request.app.state
    });

    if (routerState.code) {
        response.code(routerState.code);
    }

    if (request.app.headers) {
        Object.keys(request.app.headers).forEach((key) => {

            response.header(key, request.app.headers[key]);
        });
    }
};


internals.applyRoutes = function (server, next) {

    server.route({
        method: 'GET',
        path: '/{glob*}',
        handler: internals.routeHandler
    });


    server.route({
        method: 'GET',
        path: '/login/{glob*}',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        },
        handler: function (request, reply) {

            if (request.params.glob !== 'logout' &&
                request.auth.isAuthenticated) {

                if (request.auth.credentials.user.roles.admin) {
                    return reply.redirect('/admin');
                }

                return reply.redirect('/account');
            }

            if (!request.auth.isAuthenticated) {
                request.app.headers = {
                    'x-auth-required': true
                };
            }

            internals.routeHandler(request, reply);
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'web/main'
};
