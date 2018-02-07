'use strict';


const register = function (server, serverOptions) {

    server.route({
        method: 'GET',
        path: '/account/{glob*}',
        options: {
            auth: {
                strategy: 'session',
                scope: 'account'
            }
        },
        handler: function (request, h) {

            return h.view('account/index');
        }
    });
};


module.exports = {
    name: 'web-account',
    dependencies: [
        'auth',
        'hapi-auth-cookie',
        'hapi-mongo-models',
        'vision'
    ],
    register
};
