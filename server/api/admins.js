'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');
const Promise = require('promise');
const Config = require('../../config');


const internals = {};


internals.applyRoutes = function (server, next) {

    const models = server.plugins['hapi-sequelize'][Config.get('/db').database].models;
    const AdminGroup = models.AdminGroup;
    const AdminPermissionEntry = models.AdminPermissionEntry;
    const Admin = models.Admin;
    const Permission = models.Permission;
    const User = models.User;

    server.route({
        method: 'GET',
        path: '/admins',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    username: Joi.string().allow(''),
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
            const include = [{ model: User }];
            if (request.query.username) {
                include[0].where = { username: { $like : '%' + request.query.username + '%' } };
            }
            //const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;


            Admin.pagedFind(query, page, limit, sort, include, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/admins/{id}',
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

            Admin.findById(request.params.id, {
                include: [
                    { model: User },
                    { model: AdminGroup },
                    { model: AdminPermissionEntry, include: [{ model: Permission }] }
                ]
            }).then((admin) => {

                if (!admin) {
                    return reply(Boom.notFound('Admin not found.'));
                }

                reply(admin);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/admins',
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

            const nameParts = request.payload.name.trim().split(/\s/);
            const name = {
                first: nameParts.shift(),
                middle: nameParts.length > 1 ? nameParts.shift() : '',
                last: nameParts.join(' ')
            };
            Admin.create({
                first: name.first,
                middle: name.middle,
                last: name.last
            }).then((admin) => {

                reply(admin);
            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/admins/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('111111111111111111111111')
                },
                payload: {
                    first: Joi.string().required(),
                    middle: Joi.string().allow(''),
                    last: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            const id = request.params.id;
            Admin.update(
                {
                    first: request.payload.first,
                    middle: request.payload.middle,
                    last: request.payload.last
                },
                {
                    where:{
                        id
                    }
                }
            ).then((admin) => {

                if (!admin) {
                    return reply(Boom.notFound('Admin not found.'));
                }

                reply(admin);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/admins/{id}/permissions',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('111111111111111111111111')
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
            const adminPermissionEntries = request.payload.permissionEntries;
            const ids = adminPermissionEntries.map((permission) => {

                return permission.id;
            });
            //delete those not in set
            AdminPermissionEntry.destroy(
                {
                    where : {
                        admin_id : id,
                        id : { $notIn: ids }
                    }
                }
            ).then((count) => {

                const promises = adminPermissionEntries.map((ape) => {

                    return AdminPermissionEntry.upsert(
                        ape
                    );
                });
                return Promise.all(promises);
            }).then((results) => {

                return AdminPermissionEntry.findAll(
                    {
                        where : { admin_id: id },
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
        method: 'PUT',
        path: '/admins/{id}/groups',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('111111111111111111111111')
                },
                payload: {
                    groups: Joi.array().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            Admin.findById(request.params.id).then((admin) => {

                if (!admin){
                    return reply(Boom.notFound('Admin not found'));
                }
                return admin.setAdminGroups(request.payload.groups);
            }).then(

                (result) => {

                    reply(result);
                },
                (err) => {

                    reply(err);
                }
            );
        }
    });


    server.route({
        method: 'PUT',
        path: '/admins/{id}/user',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('111111111111111111111111')
                },
                payload: {
                    username: Joi.string().lowercase().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root'),
                {
                    assign: 'admin',
                    method: function (request, reply) {

                        Admin.findById(request.params.id).then((account) => {

                            if (!account) {
                                return reply(Boom.notFound('Account not found.'));
                            }
                            reply(account);
                        }, (err) => {

                            return reply(err);
                        });
                    }
                }, {
                    assign: 'user',
                    method: function (request, reply) {

                        User.findOne(
                            {
                                where: {
                                    username: request.payload.username
                                }
                            }
                        ).then((user) => {

                            if (!user) {
                                return reply(Boom.notFound('User not found.'));
                            }
                            reply(user);
                        }, (err) => {

                            reply(err);
                        });
                    }
                }, {
                    assign: 'userCheck',
                    method: function (request, reply) {

                        request.pre.user.getAdmin().then(

                        (account) => {

                            if ( account ){
                                return reply(Boom.conflict('User is already linked to another account. Unlink first.'));
                            }
                            reply();
                        }
                    );
                    }
                }, {
                    assign: 'adminCheck',
                    method: function (request, reply) {

                        request.pre.admin.getUser().then(

                        (account) => {

                            if ( account ){
                                return reply(Boom.conflict('Admin is already linked to another account. Unlink first.'));
                            }
                            reply();
                        }
                    );
                    }
                }]
        },
        handler: function (request, reply) {

            request.pre.admin.setUser(request.pre.user).then(

                (results) => {

                    return reply(results);
                },
                (err) => {

                    reply(err);
                }
            );
        }
    });


    server.route({
        method: 'DELETE',
        path: '/admins/{id}/user',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('111111111111111111111111')
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            Admin.findById(request.params.id).then((admin) => {

                if ( !admin ){
                    return reply(Boom.notFound('Admin not found'));
                }
                return admin.setUser(null);
            }).then( (result) => {

                reply(result);
            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/admins/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('111111111111111111111111')
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            Admin.destroy(request.params.id).then((count) => {

                if ( count === 0 ){
                    return reply(Boom.notFound('admin not found'));
                }
                reply( { message: 'success' } );
            }, (err) => {

                return reply(err);
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
    name: 'admins'
};
