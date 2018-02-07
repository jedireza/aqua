'use strict';


const register = function (server, serverOptions) {

    server.route({
        method: 'GET',
        path: '/admin/{glob*}',
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, h) {

            return h.view('admin/index');
        }
    });
};


module.exports = {
    name: 'web-admin',
    dependencies: [
        'auth',
        'hapi-auth-cookie',
        'hapi-mongo-models',
        'vision'
    ],
    register
};
