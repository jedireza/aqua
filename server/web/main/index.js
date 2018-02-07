'use strict';
const React = require('react');
const ReactDomServer = require('react-dom/server');
const ReactHelmet = require('react-helmet');
const ReactRouter = require('react-router-dom');


const internals = {};
const StaticRouter = ReactRouter.StaticRouter;


internals.routeHandler = function (request, h) {

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
        return h.redirect(routerState.url).code(routerState.code);
    }

    const content = h.view('main/index', {
        helmet,
        markup,
        state: request.app.state
    });
    const response = h.response(content);

    if (routerState.code) {
        response.code(routerState.code);
    }

    if (request.app.headers) {
        Object.keys(request.app.headers).forEach((key) => {

            response.header(key, request.app.headers[key]);
        });
    }

    return response;
};


const register = function (server, options) {

    server.route({
        method: 'GET',
        path: '/{glob*}',
        options: {
            auth: false
        },
        handler: internals.routeHandler
    });


    server.route({
        method: 'GET',
        path: '/login/{glob*}',
        options: {
            auth: {
                mode: 'try'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        },
        handler: function (request, h) {

            if (request.params.glob !== 'logout' &&
                request.auth.isAuthenticated) {

                if (request.auth.credentials.user.roles.admin) {
                    return h.redirect('/admin');
                }

                return h.redirect('/account');
            }

            if (!request.auth.isAuthenticated) {
                request.app.headers = {
                    'x-auth-required': true
                };
            }

            return internals.routeHandler(request, h);
        }
    });
};


module.exports = {
    name: 'web-main',
    dependencies: [
        'auth',
        'hapi-auth-cookie',
        'hapi-mongo-models',
        'vision'
    ],
    register
};
