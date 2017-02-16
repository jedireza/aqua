'use strict';
const AuthPlugin = require('../auth');
const Boom = require('boom');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {


    server.route({
        method: 'GET',
        path: '/sessions',
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

            const Session = request.getDb('aqua').getModel('Session');
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

            Session.pagedFind(query, page, limit, order, null, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });

        }
    });


    server.route({
        method: 'GET',
        path: '/sessions/{id}',
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

            const Session = request.getDb('aqua').getModel('Session');
            Session.findOne(
                {
                    where: {
                        id: request.params.id
                    }
                }
            ).then( (session) => {

                if (!session) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(session);

            }, (err) => {

                return reply(err);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/sessions/{id}',
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

            const Session = request.getDb('aqua').getModel('Session');
            Session.destroy(
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
    name: 'sessions'
};
