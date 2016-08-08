'use strict';

const Boom = require('boom');
const Async = require('async');
const Joi = require('joi');
const AuthPlugin = require('../auth');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Admin = server.plugins['hapi-mongo-models'].Admin;
    const User = server.plugins['hapi-mongo-models'].User;


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
            if (request.query.username) {
                query['user.name'] = new RegExp('^.*?' + request.query.username + '.*$', 'i');
            }
            const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            Admin.pagedFind(query, fields, sort, limit, page, (err, results) => {

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
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            Admin.findById(request.params.id, (err, admin) => {

                if (err) {
                    return reply(err);
                }

                if (!admin) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(admin);
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
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const name = request.payload.name;

            Admin.create(name, (err, admin) => {

                if (err) {
                    return reply(err);
                }

                reply(admin);
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
                payload: {
                    nameFirst: Joi.string().required(),
                    nameMiddle: Joi.string().allow(['', null]),
                    nameLast: Joi.string().required()
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
                    name: {
                        first: request.payload.nameFirst,
                        middle: request.payload.nameMiddle,
                        last: request.payload.nameLast
                    }
                }
            };

            Admin.findByIdAndUpdate(id, update, (err, admin) => {

                if (err) {
                    return reply(err);
                }

                if (!admin) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(admin);
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

            Admin.findByIdAndUpdate(id, update, (err, admin) => {

                if (err) {
                    return reply(err);
                }

                reply(admin);
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
                payload: {
                    groups: Joi.object().required()
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
                    groups: request.payload.groups
                }
            };

            Admin.findByIdAndUpdate(id, update, (err, admin) => {

                if (err) {
                    return reply(err);
                }

                reply(admin);
            });
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
                payload: {
                    username: Joi.string().lowercase().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root'),
                {
                    assign: 'admin',
                    method: function (request, reply) {

                        Admin.findById(request.params.id, (err, admin) => {

                            if (err) {
                                return reply(err);
                            }

                            if (!admin) {
                                return reply(Boom.notFound('Document not found.'));
                            }

                            reply(admin);
                        });
                    }
                }, {
                    assign: 'user',
                    method: function (request, reply) {

                        User.findByUsername(request.payload.username, (err, user) => {

                            if (err) {
                                return reply(err);
                            }

                            if (!user) {
                                return reply(Boom.notFound('User document not found.'));
                            }

                            if (user.roles &&
                                user.roles.admin &&
                                user.roles.admin.id !== request.params.id) {

                                return reply(Boom.conflict('User is already linked to another admin. Unlink first.'));
                            }

                            reply(user);
                        });
                    }
                }, {
                    assign: 'userCheck',
                    method: function (request, reply) {

                        if (request.pre.admin.user &&
                            request.pre.admin.user.id !== request.pre.user._id.toString()) {

                            return reply(Boom.conflict('Admin is already linked to another user. Unlink first.'));
                        }

                        reply(true);
                    }
                }
            ]
        },
        handler: function (request, reply) {

            Async.auto({
                admin: function (done) {

                    const id = request.params.id;
                    const update = {
                        $set: {
                            user: {
                                id: request.pre.user._id.toString(),
                                name: request.pre.user.username
                            }
                        }
                    };

                    Admin.findByIdAndUpdate(id, update, done);
                },
                user: function (done) {

                    const id = request.pre.user._id;
                    const update = {
                        $set: {
                            'roles.admin': {
                                id: request.pre.admin._id.toString(),
                                name: request.pre.admin.name.first + ' ' + request.pre.admin.name.last
                            }
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results.admin);
            });
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
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root'),
                {
                    assign: 'admin',
                    method: function (request, reply) {

                        Admin.findById(request.params.id, (err, admin) => {

                            if (err) {
                                return reply(err);
                            }

                            if (!admin) {
                                return reply(Boom.notFound('Document not found.'));
                            }

                            if (!admin.user || !admin.user.id) {
                                return reply(admin).takeover();
                            }

                            reply(admin);
                        });
                    }
                }, {
                    assign: 'user',
                    method: function (request, reply) {

                        User.findById(request.pre.admin.user.id, (err, user) => {

                            if (err) {
                                return reply(err);
                            }

                            if (!user) {
                                return reply(Boom.notFound('User document not found.'));
                            }

                            reply(user);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            Async.auto({
                admin: function (done) {

                    const id = request.params.id;
                    const update = {
                        $unset: {
                            user: undefined
                        }
                    };

                    Admin.findByIdAndUpdate(id, update, done);
                },
                user: function (done) {

                    const id = request.pre.user._id.toString();
                    const update = {
                        $unset: {
                            'roles.admin': undefined
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results.admin);
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
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {


            Admin.findByIdAndDelete(request.params.id, (err, admin) => {

                if (err) {
                    return reply(err);
                }

                if (!admin) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply({ message: 'Success.' });
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
    name: 'admins'
};
