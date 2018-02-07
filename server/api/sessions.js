'use strict';
const Boom = require('boom');
const Joi = require('joi');
const Preware = require('../preware');
const Session = require('../models/session');


const register = function (server, serverOptions) {

    server.route({
        method: 'GET',
        path: '/api/sessions',
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
                sort: Session.sortAdapter(request.query.sort)
            };

            return await Session.pagedFind(query, limit, page, options);
        }
    });


    server.route({
        method: 'GET',
        path: '/api/sessions/{id}',
        options: {
            auth: {
                scope: 'admin'
            },
            pre: [
                Preware.requireAdminGroup('root')
            ]
        },
        handler: async function (request, h) {

            const session = await Session.findById(request.params.id);

            if (!session) {
                throw Boom.notFound('Session not found.');
            }

            return session;
        }
    });


    server.route({
        method: 'DELETE',
        path: '/api/sessions/{id}',
        options: {
            auth: {
                scope: 'admin'
            },
            pre: [
                Preware.requireAdminGroup('root')
            ]
        },
        handler: async function (request, h) {

            const session = await Session.findByIdAndDelete(request.params.id);

            if (!session) {
                throw Boom.notFound('Session not found.');
            }

            return { message: 'Success.' };
        }
    });


    server.route({
        method: 'GET',
        path: '/api/sessions/my',
        options: {
            auth: {
                scope: ['admin', 'account']
            }
        },
        handler: async function (request, h) {

            const query = {
                userId: `${request.auth.credentials.user._id}`
            };

            return await Session.find(query);
        }
    });


    server.route({
        method: 'DELETE',
        path: '/api/sessions/my/{id}',
        handler: async function (request, h) {

            const currentSession = `${request.auth.credentials.session._id}`;

            if (currentSession === request.params.id) {
                throw Boom.badRequest(
                    'Cannot destroy your current session. Also see `/api/logout`.'
                );
            }

            const query = {
                _id: Session.ObjectID(request.params.id),
                userId: `${request.auth.credentials.user._id}`
            };

            await Session.findOneAndDelete(query);

            return { message: 'Success.' };
        }
    });
};


module.exports = {
    name: 'api-sessions',
    dependencies: [
        'auth',
        'hapi-auth-cookie',
        'hapi-mongo-models'
    ],
    register
};
