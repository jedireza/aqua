'use strict';
const Boom = require('boom');


const internals = {};


internals.applyRoutes = function (server, next) {

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
            const Session = request.getDb('aqua').getModel('Session');

            Session.destroy({
                where: {
                    id : session.id
                }
            }).then((i) => {

                if ( i === 0){
                    return reply(Boom.notFound('Document not found.'));
                }
                request.cookieAuth.clear();
                reply({ message: 'Success.' });

            }, (err) => {

                reply(err);
            });
        }
    });

    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'hapi-sequelize', 'dbconfig'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'logout'
};
