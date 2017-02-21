'use strict';
const Async = require('async');
const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Config = require('../../config');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    server.route({
        method: 'POST',
        path: '/login',
        config: {
            validate: {
                payload: {
                    username: Joi.string().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
                assign: 'abuseDetected',
                method: function (request, reply) {

                    const ip = request.info.remoteAddress;
                    const username = request.payload.username;
                    const AuthAttempt = request.getDb('aqua').getModel('AuthAttempt');

                    AuthAttempt.abuseDetected(ip, username, (err, detected) => {

                        if (err) {
                            return reply(err);
                        }

                        if (detected) {
                            return reply(Boom.badRequest('Maximum number of auth attempts reached. Please try again later.'));
                        }

                        reply();
                    });
                }
            }, {
                assign: 'user',
                method: function (request, reply) {

                    const username = request.payload.username;
                    const password = request.payload.password;
                    const User = request.getDb('aqua').getModel('User');
                    User.findByCredentials(username, password, (err, user) => {

                        if (err) {
                            return reply(err);
                        }
                        if ( user ){
                            user.hydrateRoles(request.getDb('aqua'), (err) => {

                                if ( err ){
                                    reply(err);
                                }
                                else {
                                    reply(user);
                                }
                            });
                        }
                        else {
                            reply(null);
                        }
                    });
                }
            }, {
                assign: 'logAttempt',
                method: function (request, reply) {

                    if (request.pre.user) {
                        return reply();
                    }

                    const ip = request.info.remoteAddress;
                    const username = request.payload.username;
                    const AuthAttempt = request.getDb('aqua').getModel('AuthAttempt');

                    AuthAttempt.create(
                        {
                            ip,
                            username
                        }
                    ).then((authAttempt) => {

                        return reply(Boom.badRequest('Username and password combination not found or account is inactive.'));

                    }, (err) => {

                        return reply(err);
                    });
                }
            }, {
                assign: 'session',
                method: function (request, reply) {

                    const Session = request.getDb('aqua').getModel('Session');
                    Session.createNew(request.pre.user.id.toString(), (err, session) => {

                        if (err) {
                            return reply(err);
                        }
                        return reply(session);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            const credentials = request.pre.session.id.toString() + ':' + request.pre.session.key;
            const authHeader = 'Basic ' + new Buffer(credentials).toString('base64');

            const result = {
                user: {
                    id: request.pre.user.id,
                    username: request.pre.user.username,
                    email: request.pre.user.email,
                    roles: request.pre.user.roles
                },
                session: request.pre.session,
                authHeader
            };

            request.cookieAuth.set(result);
            reply(result);
        }
    });


    server.route({
        method: 'POST',
        path: '/login/forgot',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [{
                assign: 'user',
                method: function (request, reply) {

                    const User = request.getDb('aqua').getModel('User');

                    const conditions = {
                        email: request.payload.email
                    };

                    User.findOne(
                        {
                            where : conditions
                        }
                    ).then((user) => {

                        if (!user) {
                            reply({ message: 'Success.' }).takeover();
                        }
                        else {
                            reply(user);
                        }
                    }, (err) => {

                        reply(err);
                    });

                }
            }]
        },
        handler: function (request, reply) {

            const mailer = request.server.plugins.mailer;
            const Session = request.getDb('aqua').getModel('Session');

            Async.auto({
                keyHash: function (done) {

                    Session.generateKeyHash(done);
                },
                user: ['keyHash', function (results, done) {

                    request.pre.user.update(
                        {
                            reset_token : results.keyHash.hash,
                            reset_expires: Date.now() + 10000000
                        }
                    ).then( (user) => {

                        done(user);
                    }, ( err ) => {

                        done(err);
                    });
                }],
                email: ['user', function (results, done) {

                    const emailOptions = {
                        subject: 'Reset your ' + Config.get('/projectName') + ' password',
                        to: request.payload.email
                    };
                    const template = 'forgot-password';
                    const context = {
                        baseHref: Config.get('/baseUrl') + '/login/reset',
                        email: results.user.email,
                        key: results.keyHash.key
                    };

                    //done();
                    mailer.sendEmail(emailOptions, template, context, done);
                }]
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/login/reset',
        config: {
            validate: {
                payload: {
                    key: Joi.string().required(),
                    email: Joi.string().email().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
                assign: 'user',
                method: function (request, reply) {

                    const User = request.getDb('aqua').getModel('User');
                    const conditions = {
                        email: request.payload.email,
                        'reset_expires': { $gt: Date.now() }
                    };

                    User.findOne(
                        {
                            where: conditions
                        }).then((user) => {

                            if (!user) {
                                return reply(Boom.badRequest('Invalid email or key.'));
                            }

                            reply(user);
                        },
                        (err) => {

                            reply(err);
                        }
                    );
                }
            }]
        },
        handler: function (request, reply) {

            Async.auto({
                keyMatch: function (done) {

                    const key = request.payload.key;
                    const token = request.pre.user.reset_token;
                    Bcrypt.compare(key, token, done);
                },
                passwordHash: ['keyMatch', function (results, done) {

                    if (!results.keyMatch) {
                        return reply(Boom.badRequest('Invalid email or key.'));
                    }
                    request.pre.user.update({
                        password:request.payload.password,
                        reset_token: undefined
                    }).then( (user) => {

                        done(null, user);
                    }, (err) => {

                        done(err);
                    } );
                }]
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['mailer', 'hapi-sequelize', 'dbconfig'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'login'
};
