var Confidence = require('confidence');
var Config = require('./config');


var criteria = {
    env: process.env.NODE_ENV
};


var manifest = {
    $meta: 'This file defines the plot device.',
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/web'),
        labels: ['web']
    }],
    plugins: {
        'hapi-auth-basic': {},
        'hapi-auth-cookie': {},
        'crumb': {
            restful: true
        },
        'lout': {},
        'visionary': {
            engines: {
                jsx: 'hapi-react-views'
            },
            relativeTo: __dirname,
            path: './server/web'
        },
        'hapi-mongo-models': {
            mongodb: Config.get('/hapiMongoModels/mongodb'),
            models: {
                Account: './server/models/account',
                AdminGroup: './server/models/admin-group',
                Admin: './server/models/admin',
                AuthAttempt: './server/models/auth-attempt',
                Session: './server/models/session',
                Status: './server/models/status',
                User: './server/models/user'
            },
            autoIndex: Config.get('/hapiMongoModels/autoIndex')
        },
        './server/auth': {},
        './server/mailer': {},
        './server/api/accounts': { basePath: '/api' },
        './server/api/admin-groups': { basePath: '/api' },
        './server/api/admins': { basePath: '/api' },
        './server/api/auth-attempts': { basePath: '/api' },
        './server/api/contact': { basePath: '/api' },
        './server/api/index': { basePath: '/api' },
        './server/api/login': { basePath: '/api' },
        './server/api/logout': { basePath: '/api' },
        './server/api/sessions': { basePath: '/api' },
        './server/api/signup': { basePath: '/api' },
        './server/api/statuses': { basePath: '/api' },
        './server/api/users': { basePath: '/api' },
        './server/web/about': {},
        './server/web/account': {},
        './server/web/admin': {},
        './server/web/contact': {},
        './server/web/home': {},
        './server/web/login': {},
        './server/web/public': {},
        './server/web/signup': {}
    }
};


var store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
