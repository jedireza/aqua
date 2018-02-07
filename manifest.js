'use strict';
const Boom = require('boom');
const Confidence = require('confidence');
const Config = require('./config.js');
const HapiReactViews = require('hapi-react-views');
const Path = require('path');


const criteria = {
    env: process.env.NODE_ENV
};


const manifest = {
    $meta: 'This file configures the server.',
    server: {
        port: Config.get('/port/web'),
        routes: {
            security: true,
            validate: {
                failAction: (request, h, err) => {

                    request.log(['error', 'validation'], err.details);

                    const source = err.output.payload.validation.source;
                    const message = `Invalid input (request ${source})`;
                    const badRequest = Boom.badRequest(message);

                    badRequest.output.payload.validation = err.details;

                    throw badRequest;
                }
            }
        },
        state: {
            isHttpOnly: false,
            isSecure: {
                $filter: 'env',
                production: true,
                $default: false
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: 'good',
                options: {
                    reporters: {
                        myConsoleReporter: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{
                                    error: '*',
                                    log: '*',
                                    request: '*',
                                    response:'*'
                                }]
                            },
                            {
                                module: 'good-console',
                                args: [{
                                    color: {
                                        $filter: 'env',
                                        production: false,
                                        $default: true
                                    }
                                }]
                            },
                            'stdout'
                        ]
                    }
                }
            },
            {
                plugin: 'inert'
            },
            {
                plugin: 'hapi-auth-cookie'
            },
            {
                plugin: 'hapi-remote-address'
            },
            {
                plugin: 'crumb',
                options: {
                    restful: true
                }
            },
            {
                plugin: 'vision',
                options: {
                    engines: {
                        jsx: HapiReactViews
                    },
                    compileOptions: {
                        removeCacheRegExp: '.jsx$',
                        layoutPath: Path.join(process.cwd(), './server/web/layouts')
                    },
                    relativeTo: __dirname,
                    path: './server/web'
                }
            },
            {
                plugin: 'hapi-mongo-models',
                options: {
                    mongodb: Config.get('/hapiMongoModels/mongodb'),
                    models: [
                        Path.resolve(__dirname, './server/models/account'),
                        Path.resolve(__dirname, './server/models/admin-group'),
                        Path.resolve(__dirname, './server/models/admin'),
                        Path.resolve(__dirname, './server/models/auth-attempt'),
                        Path.resolve(__dirname, './server/models/session'),
                        Path.resolve(__dirname, './server/models/status'),
                        Path.resolve(__dirname, './server/models/user')
                    ],
                    autoIndex: Config.get('/hapiMongoModels/autoIndex')
                }
            },
            {
                plugin: './server/auth'
            },
            {
                plugin: './server/api/accounts'
            },
            {
                plugin: './server/api/admin-groups'
            },
            {
                plugin: './server/api/admins'
            },
            {
                plugin: './server/api/contact'
            },
            {
                plugin: './server/api/login'
            },
            {
                plugin: './server/api/logout'
            },
            {
                plugin: './server/api/main'
            },
            {
                plugin: './server/api/sessions'
            },
            {
                plugin: './server/api/signup'
            },
            {
                plugin: './server/api/statuses'
            },
            {
                plugin: './server/api/users'
            },
            {
                plugin: './server/web/account'
            },
            {
                plugin: './server/web/admin'
            },
            {
                plugin: './server/web/main'
            },
            {
                plugin: './server/web/public'
            }
        ]
    }
};


const store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
