'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');
const Config = require('../../config');


const internals = {};


internals.applyRoutes = function (server, next) {

    const models = server.plugins['hapi-sequelize'][Config.get('/db').database].models;
    const Account = models.Account;
    const User = models.User;
    const NoteEntry = models.NoteEntry;
    const StatusEntry = models.StatusEntry;
    const Status = models.Status;

    server.route({
        method: 'GET',
        path: '/accounts',
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
            }
        },
        handler: function (request, reply) {

            const query = {};
            const include = [{ model: User }, { model: StatusEntry }, { model: NoteEntry }];
            if (request.query.username) {
                include[0].where = { username: { $like : '%' + request.query.username + '%' } };
            }
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;
            Account.pagedFind(query, page, limit, sort, include, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/accounts/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            Account.findById( request.params.id,
                {
                    include: [
                        {
                            model : User,
                            attributes: ['id', 'username', 'isActive', 'createdAt']
                        },
                        { model: NoteEntry, include: [{ model: User }] },
                        { model: StatusEntry, include: [
                            { model: User }, { model: Status }]
                        }]
                }
            ).then((account) => {

                if (!account) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(account);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/accounts/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            }
        },
        handler: function (request, reply) {

            const id = request.auth.credentials.user.id;//roles.account.id.toString();

            Account.findOne(
                {
                    include:[{ model: User, where: { id } }]
                }
            ).then( (account) => {

                if (!account) {
                    return reply(Boom.notFound('Document not found. That is strange.'));
                }

                reply(account);

            }, (err) => {

                reply(err);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/accounts',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    name: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const name = Account.parseName(request.payload.name);
            Account.create({
                first: name.first,
                middle: name.middle,
                last: name.last
            }).then( (account) => {

                reply(account);
            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/accounts/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    first: Joi.string().required(),
                    middle: Joi.string().allow(''),
                    last: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {


            const id = request.params.id;
            Account.update(
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
            ).then((account) => {

                if (!account) {
                    return reply(Boom.notFound('Account not found.'));
                }

                reply(account);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/accounts/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            },
            validate: {
                payload: {
                    first: Joi.string().required(),
                    middle: Joi.string().allow(''),
                    last: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.user.id;

            Account.update(
                {
                    first: request.payload.first,
                    middle: request.payload.middle,
                    last: request.payload.last
                },
                {
                    where:{
                        user_id : userId
                    }
                }
            ).then( (account) => {

                if (!account) {
                    return reply(Boom.notFound('Account not found.'));
                }

                reply(account);

            }, (err) => {

                return reply(err);
            });

        }
    });


    server.route({
        method: 'PUT',
        path: '/accounts/{id}/user',
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
            pre: [{
                assign: 'account',
                method: function (request, reply) {

                    Account.findById(request.params.id).then((account) => {

                        if (!account) {
                            return reply(Boom.notFound('Account not found.'));
                        }
                        account.getUser().then( (user) => {

                            if ( user ){
                                return reply(Boom.conflict('User is already linked to another account. Unlink first.'));
                            }
                            reply(account);
                        });

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
                        user.getAccount().then( (account) => {

                            if ( account ){
                                return reply(Boom.conflict('User is already linked to another account. Unlink first.'));
                            }
                            reply(user);
                        });

                    }, (err) => {

                        return reply(err);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            request.pre.account.setUser(request.pre.user).then(
                (results) => {

                    reply(results);
                },
                (err) => {

                    reply(err);
                }
            );
        }
    });


    server.route({
        method: 'DELETE',
        path: '/accounts/{id}/user',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [{
                assign: 'account',
                method: function (request, reply) {

                    Account.findById(request.params.id).then((account) => {

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

                    request.pre.account.getUser().then( (user) => {

                        reply(user);

                    }, (err) => {

                        return reply(err);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            if ( !request.pre.user ){
                return reply();
            }
            request.pre.account.setUser(null).then( (result) => {

                reply(result);
            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/accounts/{id}/notes',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    data: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const id = request.params.id;

            Account.findById(id,
                {
                    include: [
                        { model : User },
                        { model: NoteEntry, include: [{ model: User }] }, { model: StatusEntry }]
                }
            ).then((account) => {

                if ( !account){
                    return reply(Boom.notFound('Account not found'));
                }
                account.createNoteEntry({
                    data: request.payload.data,
                    user_id: request.auth.credentials.user.id
                }) .then( (result) => {

                    return account.reload();//todo figure out why we need to reload here.
                                            //for some reason the NoteEntry doesn't get appended to NoteEntries
                }) .then( (result) => {

                    reply(result);
                });
            }, (err) => {

                reply(err);
            });

        }
    });


    server.route({
        method: 'POST',
        path: '/accounts/{id}/status',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    status: Joi.string().required()
                }
            },
            pre: [{
                assign: 'status',
                method: function (request, reply) {

                    Status.findById(request.payload.status).then( (status) => {

                        if ( !status ){
                            return reply(Boom.notFound('Status not found'));
                        }
                        reply(status);
                    }, (err) => {

                        return reply(err);
                    });
                }
            },
            {
                assign: 'account',
                method: function (request, reply) {

                    Account.findById(request.params.id).then( (account) => {

                        if ( !account ){
                            return reply(Boom.notFound('Account not found'));
                        }
                        reply(account);
                    }, (err) => {

                        return reply(err);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            StatusEntry.create({
                name : request.pre.status.name,
                account_id : request.pre.account.id,
                status_id : request.pre.status.id,
                user_id: request.auth.credentials.user.id
            }).then((statusEntry) => {

                return Account.findById(request.params.id,
                    {
                        include: [
                            {
                                model : User,
                                attributes: ['id', 'username', 'isActive', 'createdAt']
                            },
                        {  model: NoteEntry, include: [{ model: User }] },
                            { model: StatusEntry, include: [
                            { model: User },
                            { model: Status }
                            ] }]
                    });
            }).then( (account) => {

                reply(account);
            }, (err) => {

                reply(err);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/accounts/{id}',
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

            Account.destroy(
                {
                    where: { id: request.params.id }
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
    name: 'account'
};
