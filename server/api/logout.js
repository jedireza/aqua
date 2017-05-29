'use strict';
const Boom = require('boom');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Session = server.plugins['hapi-mongo-models'].Session;


    server.route({
        method: 'DELETE',
        path: '/logout',
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

            const credentials = request.auth.credentials || { session: {} };
            const session = credentials.session || {};

            Session.findByIdAndDelete(session._id, (err, sessionDoc) => {

                if (err) {
                    return reply(err);
                }

                if (!sessionDoc) {
                    return reply(Boom.notFound('Document not found.'));
                }

                request.cookieAuth.clear();

                reply({ success: true });
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'logout'
};
