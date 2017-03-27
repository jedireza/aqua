'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');
const Config = require('../../config');


const internals = {};


internals.applyRoutes = function (server, next) {

    const models = server.plugins['hapi-sequelize'][Config.get('/db').database].models;
    const AuthAttempt = models.AuthAttempt;

    server.route({
        method: 'GET',
        path: '/auth-attempts',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
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
            //const fields = request.query.fields;
            let sort = request.query.sort;
            let order = '';
            if ( sort !== ''){

                let dir = 'ASC';
                if ( sort.indexOf('-') === 0 ) {
                    dir = 'DESC';
                    sort = sort.substring(1);
                }
                order = [[sort, dir]];

            }
            const limit = request.query.limit;
            const page = request.query.page;

            AuthAttempt.pagedFind(query, page, limit, order, null, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/auth-attempts/{id}',
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

            AuthAttempt.findById(request.params.id).then( (authAttempt) => {

                if (!authAttempt) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(authAttempt);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/auth-attempts/{id}',
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

            AuthAttempt.destroy(
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
    name: 'auth-attempts'
};
