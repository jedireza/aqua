'use strict';
const Session = require('../models/session');


const register = function (server, serverOptions) {

    server.route({
        method: 'DELETE',
        path: '/api/logout',
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

            request.cookieAuth.clear();

            const credentials = request.auth.credentials;

            if (!credentials) {
                return { message: 'Success.' };
            }

            Session.findByIdAndDelete(credentials.session._id);

            return { message: 'Success.' };
        }
    });
};


module.exports = {
    name: 'api-logout',
    dependencies: [
        'auth',
        'hapi-auth-cookie',
        'hapi-mongo-models'
    ],
    register
};
