'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');
const Config = require('../../config');


const internals = {};


internals.applyRoutes = function (server, next) {

    const models = server.plugins['hapi-sequelize'][Config.get('/db').database].models;
    const AdminGroup = models.AdminGroup;
    const AdminGroupPermissionEntry = models.AdminGroupPermissionEntry;
    const Admin = models.Admin;
    const Permission = models.Permission;

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
                    sort: Joi.string().default('id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            const query = {};
            const include = [{ model: Admin }];
            if (request.query.username) {
                query.name = { $like : '%' + request.query.name + '%'  };
            }
            //const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            AdminGroup.pagedFind(query, page, limit, sort, include, (err, results) => {

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
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            AdminGroup.findById(request.params.id,
                {
                    include: [{ model : Admin },
                               { model: AdminGroupPermissionEntry, include: [{ model: Permission }] }
                    ]
                }
            ).then((adminGroup) => {

                if (!adminGroup) {
                    return reply(Boom.notFound('Admin group not found.'));
                }

                reply(adminGroup);

            }, (err) => {

                return reply(err);
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
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {


            AdminGroup.create({
                name: request.payload.name
            }).then((adminGroup) => {

                reply(adminGroup);
            }, (err) => {

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
                    id: Joi.string().invalid('Root')
                },
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
            AdminGroup.update(
                {
                    name: request.payload.name
                },
                {
                    where:{
                        id
                    }
                }
            ).then((adminGroup) => {

                if (!adminGroup) {
                    return reply(Boom.notFound('Admin Group not found.'));
                }

                reply(adminGroup);

            }, (err) => {

                return reply(err);
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
                    id: Joi.string().invalid('Root')
                },
                payload: {
                    permissionEntries: Joi.array().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const adminGroupPermissionEntries = request.payload.permissionEntries;
            const ids = adminGroupPermissionEntries.map((permission) => {

                return permission.id;
            });
            //delete those not in set
            AdminGroupPermissionEntry.destroy(
                {
                    where : {
                        admin_group_id : id,
                        id : { $notIn: ids }
                    }
                }
            ).then((count) => {

                const promises = adminGroupPermissionEntries.map((agpe) => {

                    return AdminGroupPermissionEntry.upsert(
                        agpe
                    );
                });
                return Promise.all(promises);
            }).then((results) => {

                return AdminGroupPermissionEntry.findAll(
                    {
                        where : { admin_group_id: id },
                        include: [{ model: Permission }]
                    }
                );
            }).then( (permissionEntries) => {

                reply({ permissionEntries });
            }, (err) => {

                return reply(err);
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
                    id: Joi.string().invalid('Root')
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {


            AdminGroup.destroy(
                {
                    where: { id: request.params.id }
                }
            ).then((count) => {

                if (count === 0) {
                    return reply(Boom.notFound('Admin Group not found.'));
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
    name: 'admin-groups'
};
