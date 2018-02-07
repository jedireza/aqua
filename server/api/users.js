'use strict';
const Admin = require('../models/admin');
const Account = require('../models/account');
const Boom = require('boom');
const Joi = require('joi');
const Preware = require('../preware');
const User = require('../models/user');


const register = function (server, serverOptions) {

    server.route({
        method: 'GET',
        path: '/api/users',
        options: {
            auth: {
                scope: 'admin'
            },
            validate: {
                query: {
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                Preware.requireAdminGroup('root')
            ]
        },
        handler: async function (request, h) {

            const query = {};
            const limit = request.query.limit;
            const page = request.query.page;
            const options = {
                sort: User.sortAdapter(request.query.sort)
            };

            return await User.pagedFind(query, page, limit, options);
        }
    });


    server.route({
        method: 'POST',
        path: '/api/users',
        options: {
            auth: {
                scope: 'admin'
            },
            validate: {
                payload: {
                    username: Joi.string().token().lowercase().required(),
                    password: Joi.string().required(),
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [
                Preware.requireAdminGroup('root'),
                {
                    assign: 'usernameCheck',
                    method: async function (request, h) {

                        const user = await User.findByUsername(request.payload.username);

                        if (user) {
                            throw Boom.conflict('Username already in use.');
                        }

                        return h.continue;
                    }
                }, {
                    assign: 'emailCheck',
                    method: async function (request, h) {

                        const user = await User.findByEmail(request.payload.email);

                        if (user) {
                            throw Boom.conflict('Email already in use.');
                        }

                        return h.continue;
                    }
                }
            ]
        },
        handler: async function (request, h) {

            const username = request.payload.username;
            const password = request.payload.password;
            const email = request.payload.email;

            return await User.create(username, password, email);
        }
    });


    server.route({
        method: 'GET',
        path: '/api/users/{id}',
        options: {
            auth: {
                scope: 'admin'
            },
            pre: [
                Preware.requireAdminGroup('root')
            ]
        },
        handler: async function (request, h) {

            const user = await User.findById(request.params.id);

            if (!user) {
                throw Boom.notFound('User not found.');
            }

            return user;
        }
    });


    server.route({
        method: 'PUT',
        path: '/api/users/{id}',
        options: {
            auth: {
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
                Preware.requireAdminGroup('root'),
                {
                    assign: 'usernameCheck',
                    method: async function (request, h) {

                        const conditions = {
                            username: request.payload.username,
                            _id: { $ne: User._idClass(request.params.id) }
                        };
                        const user = await User.findOne(conditions);

                        if (user) {
                            throw Boom.conflict('Username already in use.');
                        }

                        return h.continue;
                    }
                }, {
                    assign: 'emailCheck',
                    method: async function (request, h) {

                        const conditions = {
                            email: request.payload.email,
                            _id: { $ne: User._idClass(request.params.id) }
                        };
                        const user = await User.findOne(conditions);

                        if (user) {
                            throw Boom.conflict('Email already in use.');
                        }

                        return h.continue;
                    }
                }
            ]
        },
        handler: async function (request, h) {

            const updateUser = {
                $set: {
                    isActive: request.payload.isActive,
                    username: request.payload.username,
                    email: request.payload.email
                }
            };
            const queryByUserId = {
                'user.id': request.params.id
            };
            const updateRole = {
                $set: {
                    'user.name': request.payload.username
                }
            };
            const user = await User.findByIdAndUpdate(request.params.id, updateUser);

            if (!user) {
                throw Boom.notFound('User not found.');
            }

            await Promise.all([
                Account.findOneAndUpdate(queryByUserId, updateRole),
                Admin.findOneAndUpdate(queryByUserId, updateRole)
            ]);

            return user;
        }
    });


    server.route({
        method: 'DELETE',
        path: '/api/users/{id}',
        options: {
            auth: {
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('000000000000000000000000')
                }
            },
            pre: [
                Preware.requireAdminGroup('root')
            ]
        },
        handler: async function (request, h) {

            const user = await User.findByIdAndDelete(request.params.id);

            if (!user) {
                throw Boom.notFound('User not found.');
            }

            return { message: 'Success.' };
        }
    });


    server.route({
        method: 'PUT',
        path: '/api/users/{id}/password',
        options: {
            auth: {
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
                Preware.requireAdminGroup('root')
            ]
        },
        handler: async function (request, h) {

            const password = await User.generatePasswordHash(request.payload.password);
            const update = {
                $set: {
                    password: password.hash
                }
            };
            const user = await User.findByIdAndUpdate(request.params.id, update);

            if (!user) {
                throw Boom.notFound('User not found.');
            }

            return user;
        }
    });


    server.route({
        method: 'GET',
        path: '/api/users/my',
        options: {
            auth: {
                scope: ['admin', 'account']
            }
        },
        handler: async function (request, h) {

            const id = request.auth.credentials.user._id;
            const fields = User.fieldsAdapter('username email roles');

            return await User.findById(id, fields);
        }
    });


    server.route({
        method: 'PUT',
        path: '/api/users/my',
        options: {
            auth: {
                scope: ['admin', 'account']
            },
            validate: {
                payload: {
                    username: Joi.string().token().lowercase().required(),
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [
                Preware.requireNotRootUser,
                {
                    assign: 'usernameCheck',
                    method: async function (request, h) {

                        const conditions = {
                            username: request.payload.username,
                            _id: { $ne: request.auth.credentials.user._id }
                        };
                        const user = await User.findOne(conditions);

                        if (user) {
                            throw Boom.conflict('Username already in use.');
                        }

                        return h.continue;
                    }
                }, {
                    assign: 'emailCheck',
                    method: async function (request, h) {

                        const conditions = {
                            email: request.payload.email,
                            _id: { $ne: request.auth.credentials.user._id }
                        };
                        const user = await User.findOne(conditions);

                        if (user) {
                            throw Boom.conflict('Email already in use.');
                        }

                        return h.continue;
                    }
                }
            ]
        },
        handler: async function (request, h) {

            const userId = `${request.auth.credentials.user._id}`;
            const updateUser = {
                $set: {
                    username: request.payload.username,
                    email: request.payload.email
                }
            };
            const findOptions = {
                fields: User.fieldsAdapter('username email roles')
            };
            const queryByUserId = {
                'user.id': userId
            };
            const updateRole = {
                $set: {
                    'user.name': request.payload.username
                }
            };
            const [user] = await Promise.all([
                User.findByIdAndUpdate(userId, updateUser, findOptions),
                Account.findOneAndUpdate(queryByUserId, updateRole),
                Admin.findOneAndUpdate(queryByUserId, updateRole)
            ]);

            return user;
        }
    });


    server.route({
        method: 'PUT',
        path: '/api/users/my/password',
        options: {
            auth: {
                scope: ['admin', 'account']
            },
            validate: {
                payload: {
                    password: Joi.string().required()
                }
            },
            pre: [
                Preware.requireNotRootUser
            ]
        },
        handler: async function (request, h) {

            const userId = `${request.auth.credentials.user._id}`;
            const password = await User.generatePasswordHash(request.payload.password);
            const update = {
                $set: {
                    password: password.hash
                }
            };
            const findOptions = {
                fields: User.fieldsAdapter('username email')
            };

            return await User.findByIdAndUpdate(userId, update, findOptions);
        }
    });
};


module.exports = {
    name: 'api-users',
    dependencies: [
        'auth',
        'hapi-auth-cookie',
        'hapi-mongo-models'
    ],
    register
};
