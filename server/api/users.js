'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    server.route({
        method: 'GET',
        path: '/users',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    username: Joi.string().allow(''),
                    isActive: Joi.string().allow(''),
                    role: Joi.string().allow(''),
                    //fields: Joi.string(),
                    sort: Joi.string().default('id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')//capitalized for the name.
                                                           //This is a specific group perhaps is should be addressed by Id?
            ]
        },
        handler: function (request, reply) {

            const query = {};
            let isAdmin = false;
            let isAccount = false;
            if (request.query.username) {
                query.username = { $like:  '%' + request.query.username + '%' };
            }
            if (request.query.isActive) {
                query.isActive = request.query.isActive === 'true';
            }
            if (request.query.role) {
                if ( request.query.role === 'admin'){
                    isAdmin = true;
                }
                if ( request.query.role === 'account'){
                    isAccount = true;
                }
            }
            //const fields = request.query.fields;
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

            const User = request.getDb('aqua').getModel('User');
            User.pagedFind(request.getDb('aqua').getModels(), query, request.query.page, request.query.limit, order, isAdmin, isAccount,
                 (err, data) => {

                     if ( err ){
                         return reply(err);
                     }
                     reply(data);

                 });
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{id}',
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

            const User = request.getDb('aqua').getModel('User');
            User.findById(request.params.id,
                {
                    raw: true,//todo raw? also put password hash stuff in model def
                    attributes : {
                        exclude: 'password_hash'
                    }
                }
            ).then((user) => {

                if (!user){
                    return reply(Boom.notFound('User not found.'));
                }
                reply(user);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/users/my',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin', 'account']
            }
        },
        handler: function (request, reply) {

            const id = request.auth.credentials.user.id.toString();
            //const fields = User.fieldsAdapter('username email roles');

            const User = request.getDb('aqua').getModel('User');
            //don't I have the user already?
            User.findById(id,
                {
                    raw: true,
                    attributes : {
                        exclude: 'password_hash'
                    }
                }

            ).then((user) => {

                if (!user){
                    return reply(Boom.notFound('User not found.'));
                }
                reply(user);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/users',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    username: Joi.string().token().lowercase().required(),
                    email: Joi.string().email().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root'),
                {
                    assign: 'usernameCheck',
                    method: function (request, reply) {

                        const User = request.getDb('aqua').getModel('User');
                        const conditions = {
                            username: request.payload.username
                        };

                        User.findOne({
                            where: conditions
                        }).then( (user) => {

                            if ( user ){
                                return reply(Boom.conflict('Username already in use.'));
                            }
                            reply(true);
                        }, (err) => {

                            reply(err);
                        });
                    }
                },
                {
                    assign: 'emailCheck',
                    method: function (request, reply) {

                        const User = request.getDb('aqua').getModel('User');
                        const conditions = {
                            email: request.payload.email
                        };

                        User.findOne({
                            where : conditions
                        }).then( (user) => {

                            if ( user ){
                                return reply(Boom.conflict('Email already in use.'));
                            }
                            reply(true);
                        }, (err) => {

                            reply(err);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            const User = request.getDb('aqua').getModel('User');
            User.create({
                username : request.payload.username,
                isActive: true,
                password : request.payload.password,
                email : request.payload.email
            }).then( (user) => {

                reply(user);
            }, (err) => {

                reply(err);
            });

        }
    });


    server.route({
        method: 'PUT',
        path: '/users/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('000000000000000000000000')
                },
                payload: {
                    isActive: Joi.boolean().required(),
                    username: Joi.string().token().lowercase().required(),
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root'),
                {
                    assign: 'usernameCheck',
                    method: function (request, reply) {

                        const conditions = {
                            username: request.payload.username,
                            id: { $ne: request.params.id }
                        };
                        const User = request.getDb('aqua').getModel('User');
                        User.findOne(
                            {
                                where : conditions
                            }
                        ).then((user) => {

                            if (user){
                                return reply(Boom.conflict('Username already in use.'));
                            }
                            reply(true);

                        }, (err) => {

                            return reply(err);
                        });
                    }
                }, {
                    assign: 'emailCheck',
                    method: function (request, reply) {

                        const conditions = {
                            email: request.payload.email,
                            id: { $ne: request.params.id }
                        };
                        const User = request.getDb('aqua').getModel('User');
                        User.findOne(
                            {
                                where : conditions
                            }
                        ).then((user) => {

                            if (user){
                                return reply(Boom.conflict('Email already in use.'));
                            }
                            reply(true);

                        }, (err) => {

                            return reply(err);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            const User = request.getDb('aqua').getModel('User');
            User.update(
                {
                    isActive: request.payload.isActive,
                    username: request.payload.username,
                    email: request.payload.email
                },
                {
                    where : { id : request.params.id }
                }
                ).then((user) => {

                    if (!user) {
                        return reply(Boom.notFound('Document not found.'));
                    }

                    reply(user);

                }, (err) => {

                    return reply(err);
                });
        }
    });

    server.route({
        method: 'PUT',
        path: '/users/my',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin', 'account']
            },
            validate: {
                payload: {
                    username: Joi.string().token().lowercase().required(),
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureNotRoot,
                {
                    assign: 'usernameCheck',
                    method: function (request, reply) {

                        const conditions = {
                            username: request.payload.username,
                            id: { $ne: request.auth.credentials.user.id }
                        };
                        const User = request.getDb('aqua').getModel('User');
                        User.findOne(
                            {
                                where : conditions
                            }
                        ).then((user) => {

                            if (user){
                                return reply(Boom.conflict('Username already in use.'));
                            }
                            reply(true);

                        }, (err) => {

                            return reply(err);
                        });
                    }
                }, {
                    assign: 'emailCheck',
                    method: function (request, reply) {

                        const User = request.getDb('aqua').getModel('User');
                        const conditions = {
                            email: request.payload.email,
                            id: { $ne: request.auth.credentials.user.id }
                        };
                        User.findOne(
                            {
                                where : conditions
                            }
                        ).then((user) => {

                            if (user){
                                return reply(Boom.conflict('Email already in use.'));
                            }
                            reply(true);

                        }, (err) => {

                            return reply(err);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            const User = request.getDb('aqua').getModel('User');
            const id = request.auth.credentials.user.id.toString();
            User.update(
                {
                    isActive: request.payload.isActive,
                    username: request.payload.username,
                    email: request.payload.email
                },
                {
                    where : { id }
                }
                ).then((user) => {

                    if (!user) {
                        return reply(Boom.notFound('Document not found.'));
                    }

                    reply(user);

                }, (err) => {

                    return reply(err);
                });
        }
    });

    server.route({
        method: 'PUT',
        path: '/users/{id}/password',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('000000000000000000000000')
                },
                payload: {
                    password: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            const User = request.getDb('aqua').getModel('User');
            User.update(
                {
                    password: request.payload.password
                },
                {
                    where : { id : request.params.id },
                    individualHooks:true
                }
                ).then((result) => {

                    if (result === 0) {
                        return reply(Boom.notFound('User not found.'));
                    }

                    //todo should anything be passed back?
                    reply(result);

                }, (err) => {

                    return reply(err);
                });
        }
    });

    server.route({
        method: 'PUT',
        path: '/users/my/password',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin', 'account']
            },
            validate: {
                payload: {
                    password: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureNotRoot
            ]
        },
        handler: function (request, reply) {

            const User = request.getDb('aqua').getModel('User');
            User.update(
                {
                    password: request.payload.password
                },
                {
                    where : { id : request.params.id },
                    individualHooks:true
                }
                ).then((result) => {

                    if (result === 0) {
                        return reply(Boom.notFound('User not found.'));
                    }

                    reply(result);

                }, (err) => {

                    return reply(err);
                });

        }
    });


    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('000000000000000000000000')
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('Root')
            ]
        },
        handler: function (request, reply) {

            const User = request.getDb('aqua').getModel('User');
            User.destroy({
                where: {
                    id : request.params.id
                }
            }).then((count) => {

                if (count !== 1){
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
    name: 'users'
};
