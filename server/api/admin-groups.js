'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const AdminGroup = server.plugins['hapi-mongo-models'].AdminGroup;


    server.route({
        method: 'GET',
        path: '/admin-groups',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    name: Joi.string().allow(''),
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

            const query = {};
            if (request.query.name) {
                query.name = new RegExp('^.*?' + EscapeRegExp(request.query.name) + '.*$', 'i');
            }
            const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            AdminGroup.pagedFind(query, fields, sort, limit, page, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/admin-groups/{id}',
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

            AdminGroup.findById(request.params.id, (err, adminGroup) => {

                if (err) {
                    return reply(err);
                }

                if (!adminGroup) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/admin-groups',
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

            const name = request.payload.name;

            AdminGroup.create(name, (err, adminGroup) => {

                if (err) {
                    return reply(err);
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/admin-groups/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('root')
                },
                payload: {
                    name: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    name: request.payload.name
                }
            };

            AdminGroup.findByIdAndUpdate(id, update, (err, adminGroup) => {

                if (err) {
                    return reply(err);
                }

                if (!adminGroup) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/admin-groups/{id}/permissions',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('root')
                },
                payload: {
                    permissions: Joi.object().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    permissions: request.payload.permissions
                }
            };

            AdminGroup.findByIdAndUpdate(id, update, (err, adminGroup) => {

                if (err) {
                    return reply(err);
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/admin-groups/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('root')
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            AdminGroup.findByIdAndDelete(request.params.id, (err, adminGroup) => {

                if (err) {
                    return reply(err);
                }

                if (!adminGroup) {
                    return reply(Boom.notFound('Document not found.'));
                }

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
    name: 'admin-groups'
};
