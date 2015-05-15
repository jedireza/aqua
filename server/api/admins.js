var Async = require('async');
var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'GET',
        path: options.basePath + '/admins',
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

            var Admin = request.server.plugins['hapi-mongo-models'].Admin;
            var query = {};
            if (request.query.username) {
                query['user.name'] = new RegExp('^.*?' + request.query.username + '.*$', 'i');
            }
            var fields = request.query.fields;
            var sort = request.query.sort;
            var limit = request.query.limit;
            var page = request.query.page;

            Admin.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/admins/{id}',
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

            var Admin = request.server.plugins['hapi-mongo-models'].Admin;

            Admin.findById(request.params.id, function (err, admin) {

                if (err) {
                    return reply(err);
                }

                if (!admin) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(admin);
            });
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/admins',
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

            var Admin = request.server.plugins['hapi-mongo-models'].Admin;
            var name = request.payload.name;

            Admin.create(name, function (err, admin) {

                if (err) {
                    return reply(err);
                }

                reply(admin);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/admins/{id}',
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

            var Admin = request.server.plugins['hapi-mongo-models'].Admin;
            var id = request.params.id;
            var update = {
                $set: {
                    name: {
                        first: request.payload.nameFirst,
                        middle: request.payload.nameMiddle,
                        last: request.payload.nameLast
                    }
                }
            };

            Admin.findByIdAndUpdate(id, update, function (err, admin) {

                if (err) {
                    return reply(err);
                }

                if (!admin) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(admin);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/admins/{id}/permissions',
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

            var Admin = request.server.plugins['hapi-mongo-models'].Admin;
            var id = request.params.id;
            var update = {
                $set: {
                    permissions: request.payload.permissions
                }
            };

            Admin.findByIdAndUpdate(id, update, function (err, admin) {

                if (err) {
                    return reply(err);
                }

                reply(admin);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/admins/{id}/groups',
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

            var Admin = request.server.plugins['hapi-mongo-models'].Admin;
            var id = request.params.id;
            var update = {
                $set: {
                    groups: request.payload.groups
                }
            };

            Admin.findByIdAndUpdate(id, update, function (err, admin) {

                if (err) {
                    return reply(err);
                }

                reply(admin);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/admins/{id}/user',
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

                        var Admin = request.server.plugins['hapi-mongo-models'].Admin;

                        Admin.findById(request.params.id, function (err, admin) {

                            if (err) {
                                return reply(err);
                            }

                            if (!admin) {
                                return reply({ message: 'Document not found.' }).takeover().code(404);
                            }

                            reply(admin);
                        });
                    }
                }, {
                    assign: 'user',
                    method: function (request, reply) {

                        var User = request.server.plugins['hapi-mongo-models'].User;

                        User.findByUsername(request.payload.username, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (!user) {
                                return reply({ message: 'User document not found.' }).takeover().code(404);
                            }

                            if (user.roles &&
                                user.roles.admin &&
                                user.roles.admin.id !== request.params.id) {

                                var response = {
                                    message: 'User is already linked to another admin. Unlink first.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(user);
                        });
                    }
                }, {
                    assign: 'userCheck',
                    method: function (request, reply) {

                        if (request.pre.admin.user &&
                            request.pre.admin.user.id !== request.pre.user._id.toString()) {

                            var response = {
                                message: 'Admin is already linked to another user. Unlink first.'
                            };

                            return reply(response).takeover().code(409);
                        }

                        reply(true);
                    }
                }
            ]
        },
        handler: function (request, reply) {

            Async.auto({
                admin: function (done) {

                    var Admin = request.server.plugins['hapi-mongo-models'].Admin;
                    var id = request.params.id;
                    var update = {
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

                    var User = request.server.plugins['hapi-mongo-models'].User;
                    var id = request.pre.user._id;
                    var update = {
                        $set: {
                            'roles.admin': {
                                id: request.pre.admin._id.toString(),
                                name: request.pre.admin.name.first + ' ' + request.pre.admin.name.last
                            }
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }
            }, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results.admin);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/admins/{id}/user',
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

                        var Admin = request.server.plugins['hapi-mongo-models'].Admin;

                        Admin.findById(request.params.id, function (err, admin) {

                            if (err) {
                                return reply(err);
                            }

                            if (!admin) {
                                return reply({ message: 'Document not found.' }).takeover().code(404);
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

                        var User = request.server.plugins['hapi-mongo-models'].User;

                        User.findById(request.pre.admin.user.id, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (!user) {
                                return reply({ message: 'User document not found.' }).takeover().code(404);
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

                    var Admin = request.server.plugins['hapi-mongo-models'].Admin;
                    var id = request.params.id;
                    var update = {
                        $unset: {
                            user: undefined
                        }
                    };

                    Admin.findByIdAndUpdate(id, update, done);
                },
                user: function (done) {

                    var User = request.server.plugins['hapi-mongo-models'].User;
                    var id = request.pre.user._id.toString();
                    var update = {
                        $unset: {
                            'roles.admin': undefined
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }
            }, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results.admin);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/admins/{id}',
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

            var Admin = request.server.plugins['hapi-mongo-models'].Admin;

            Admin.findByIdAndDelete(request.params.id, function (err, admin) {

                if (err) {
                    return reply(err);
                }

                if (!admin) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'admins'
};
