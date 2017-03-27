'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');
const Config = require('../../config');

const internals = {};


internals.applyRoutes = function (server, next) {

    const models = server.plugins['hapi-sequelize'][Config.get('/db').database].models;
    const Status = models.Status;

    server.route({
        method: 'GET',
        path: '/statuses',
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
                    sort: Joi.string().default('id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            }
        },
        handler: function (request, reply) {

            const query = {};
            if (request.query.pivot) {
                query.pivot = { $like: '%' + request.query.pivot + '%' };
            }
            if (request.query.name) {
                query.name = { $like: '%' + request.query.name + '%' };
            }
            //const fields = request.query.fields;
            const limit = request.query.limit;
            const page = request.query.page;

            let sort = request.query.sort;
            let order = '';
            if ( sort !== ''){
                let dir = 'ASC';
                if ( sort.indexOf('-') === 0 ){

                    dir = 'DESC';
                    sort = sort.substring(1);
                }
                order = [[sort, dir]];

            }
            Status.pagedFind(query, page, limit, order, (err, results) => {

                if (err) {

                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/statuses/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            Status.findById(request.params.id).then( (status) => {

                if (!status) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(status);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/statuses',
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
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            const pivot = request.payload.pivot;
            const name = request.payload.name;

            Status.create(
                {
                    pivot,
                    name
                }
            ).then((status) => {

                reply(status);
            },(err) => {

                return reply(err);
            });

        }
    });


    server.route({
        method: 'PUT',
        path: '/statuses/{id}',
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
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            const id = request.params.id;

            Status.update(
                {
                    name: request.payload.name
                },
                {
                    where:{
                        id
                    }
                }).then((count) => {

                    if ( count === 0 ) {
                        return reply(Boom.notFound('Document not found.'));
                    }

                    reply(count);

                }, (err) => {

                    return reply(err);
                });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/statuses/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            Status.destroy(
                {
                    where: { id : request.params.id }
                }
            ).then((count) => {

                if (count === 0) {
                    return reply(Boom.notFound('Document not found.'));
                }

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
    name: 'statuses'
};
