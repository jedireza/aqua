'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');
const Config = require('../../config');

const internals = {};

internals.applyRoutes = function (server, next) {

    const models = server.plugins['hapi-sequelize'][Config.get('/db').database].models;
    const Permission = models.Permission;

    server.route({
        method: 'GET',
        path: '/permissions',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    name: Joi.string().allow(''),
                    fields: Joi.string(),
                    sort: Joi.string().default('id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            }
        },
        handler: function (request, reply) {

            const query = {};
            if (request.query.name) {
                query.name = { $like: '%' + request.query.name + '%' };
            }
            //const fields = request.query.fields;
            const limit = request.query.limit;
            const page = request.query.page;

            let sort = request.query.sort;
            let order = '';
            if (sort !== ''){
                let dir = 'ASC';
                if ( sort.indexOf('-') === 0 ){
                    dir = 'DESC';
                    sort = sort.substring(1);
                }
                order = [[sort, dir]];

            }
            Permission.pagedFind(query, page, limit, order, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/permissions/{id}',
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

            Permission.findOne(
                {
                    where: {
                        id: request.params.id
                    }
                }
            ).then((status) => {

                if (!status) {
                    return reply(Boom.notFound('Permission not found.'));
                }

                reply(status);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/permissions',
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

            const name = request.payload.name;

            Permission.create(
                {
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
        path: '/permissions/{id}',
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

            Permission.update(
                {
                    name: request.payload.name
                },
                {
                    where:{
                        id
                    }
                }).then((status) => {

                    if (!status) {
                        return reply(Boom.notFound('Permission not found.'));
                    }

                    reply(status);

                }, (err) => {

                    return reply(err);
                });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/permissions/{id}',
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

            Permission.findByIdAndDelete(request.params.id, (err, status) => {

                if (err) {
                    return reply(err);
                }

                if (!status) {
                    return reply(Boom.notFound('Permission not found.'));
                }

                reply({ message: 'Success.' });
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
    name: 'permissions'
};
