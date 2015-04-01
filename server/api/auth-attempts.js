var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'GET',
        path: options.basePath + '/auth-attempts',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AuthAttempt = request.server.plugins['hapi-mongo-models'].AuthAttempt;
            var query = {};
            var fields = request.query.fields;
            var sort = request.query.sort;
            var limit = request.query.limit;
            var page = request.query.page;

            AuthAttempt.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/auth-attempts/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AuthAttempt = request.server.plugins['hapi-mongo-models'].AuthAttempt;

            AuthAttempt.findById(request.params.id, function (err, authAttempt) {

                if (err) {
                    return reply(err);
                }

                if (!authAttempt) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(authAttempt);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/auth-attempts/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AuthAttempt = request.server.plugins['hapi-mongo-models'].AuthAttempt;

            AuthAttempt.findByIdAndDelete(request.params.id, function (err, authAttempt) {

                if (err) {
                    return reply(err);
                }

                if (!authAttempt) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'auth-attempts'
};
