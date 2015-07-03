var Hoek = require('hoek');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'DELETE',
        path: options.basePath + '/logout',
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

            var Session = request.server.plugins['hapi-mongo-models'].Session;
            var credentials = request.auth.credentials || { session: {} };
            var session = credentials.session || {};

            Session.findByIdAndDelete(session._id, function (err, sessionDoc) {

                if (err) {
                    return reply(err);
                }

                if (!sessionDoc) {
                    return reply({ message: 'Session not found.' }).code(404);
                }

                request.auth.session.clear();
                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'logout'
};
