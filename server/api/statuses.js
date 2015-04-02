var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'GET',
        path: options.basePath + '/statuses',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    name: Joi.string().allow(''),
                    pivot: Joi.string().allow(''),
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

            var Status = request.server.plugins['hapi-mongo-models'].Status;
            var query = {};
            if (request.query.pivot) {
                query.pivot = new RegExp('^.*?' + request.query.pivot + '.*$', 'i');
            }
            if (request.query.name) {
                query.name = new RegExp('^.*?' + request.query.name + '.*$', 'i');
            }
            var fields = request.query.fields;
            var sort = request.query.sort;
            var limit = request.query.limit;
            var page = request.query.page;

            Status.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/statuses/{id}',
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

            var Status = request.server.plugins['hapi-mongo-models'].Status;

            Status.findById(request.params.id, function (err, status) {

                if (err) {
                    return reply(err);
                }

                if (!status) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(status);
            });
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/statuses',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    pivot: Joi.string().required(),
                    name: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Status = request.server.plugins['hapi-mongo-models'].Status;
            var pivot = request.payload.pivot;
            var name = request.payload.name;

            Status.create(pivot, name, function (err, status) {

                if (err) {
                    return reply(err);
                }

                reply(status);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/statuses/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    name: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Status = request.server.plugins['hapi-mongo-models'].Status;
            var id = request.params.id;
            var update = {
                $set: {
                    name: request.payload.name
                }
            };

            Status.findByIdAndUpdate(id, update, function (err, status) {

                if (err) {
                    return reply(err);
                }

                if (!status) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(status);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/statuses/{id}',
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

            var Status = request.server.plugins['hapi-mongo-models'].Status;

            Status.findByIdAndDelete(request.params.id, function (err, status) {

                if (err) {
                    return reply(err);
                }

                if (!status) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'statuses'
};
