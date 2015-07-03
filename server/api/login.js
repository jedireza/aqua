var Joi = require('joi');
var Hoek = require('hoek');
var Async = require('async');
var Bcrypt = require('bcrypt');
var Config = require('../../config');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'POST',
        path: options.basePath + '/login',
        config: {
            validate: {
                payload: {
                    username: Joi.string().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            pre: [{
                assign: 'abuseDetected',
                method: function (request, reply) {

                    var AuthAttempt = request.server.plugins['hapi-mongo-models'].AuthAttempt;
                    var ip = request.info.remoteAddress;
                    var username = request.payload.username;

                    AuthAttempt.abuseDetected(ip, username, function (err, detected) {

                        if (err) {
                            return reply(err);
                        }

                        if (detected) {
                            return reply({
                                message: 'Maximum number of auth attempts reached. Please try again later.'
                            }).takeover().code(400);
                        }

                        reply();
                    });
                }
            }, {
                assign: 'user',
                method: function (request, reply) {

                    var User = request.server.plugins['hapi-mongo-models'].User;
                    var username = request.payload.username;
                    var password = request.payload.password;

                    User.findByCredentials(username, password, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        reply(user);
                    });
                }
            }, {
                assign: 'logAttempt',
                method: function (request, reply) {

                    if (request.pre.user) {
                        return reply();
                    }

                    var AuthAttempt = request.server.plugins['hapi-mongo-models'].AuthAttempt;
                    var ip = request.info.remoteAddress;
                    var username = request.payload.username;

                    AuthAttempt.create(ip, username, function (err, authAttempt) {

                        if (err) {
                            return reply(err);
                        }

                        return reply({
                            message: 'Username and password combination not found or account is inactive.'
                        }).takeover().code(400);
                    });
                }
            }, {
                assign: 'session',
                method: function (request, reply) {

                    var Session = request.server.plugins['hapi-mongo-models'].Session;

                    Session.create(request.pre.user._id.toString(), function (err, session) {

                        if (err) {
                            return reply(err);
                        }

                        return reply(session);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            var credentials = request.pre.session._id.toString() + ':' + request.pre.session.key;
            var authHeader = 'Basic ' + new Buffer(credentials).toString('base64');

            var result = {
                user: {
                    _id: request.pre.user._id,
                    username: request.pre.user.username,
                    email: request.pre.user.email,
                    roles: request.pre.user.roles
                },
                session: request.pre.session,
                authHeader: authHeader
            };

            request.auth.session.set(result);
            reply(result);
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/login/forgot',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [{
                assign: 'user',
                method: function (request, reply) {

                    var User = request.server.plugins['hapi-mongo-models'].User;
                    var conditions = {
                        email: request.payload.email
                    };

                    User.findOne(conditions, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        if (!user) {
                            return reply({ message: 'Success.' }).takeover();
                        }

                        reply(user);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            var Session = request.server.plugins['hapi-mongo-models'].Session;
            var User = request.server.plugins['hapi-mongo-models'].User;
            var mailer = request.server.plugins.mailer;

            Async.auto({
                keyHash: function (done) {

                    Session.generateKeyHash(done);
                },
                user: ['keyHash', function (done, results) {

                    var id = request.pre.user._id.toString();
                    var update = {
                        $set: {
                            resetPassword: {
                                token: results.keyHash.hash,
                                expires: Date.now() + 10000000
                            }
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }],
                email: ['user', function (done, results) {

                    var emailOptions = {
                        subject: 'Reset your ' + Config.get('/projectName') + ' password',
                        to: request.payload.email
                    };
                    var template = 'forgot-password';
                    var context = {
                        baseHref: Config.get('/baseUrl') + '/login/reset',
                        email: request.payload.email,
                        key: results.keyHash.key
                    };

                    mailer.sendEmail(emailOptions, template, context, done);
                }]
            }, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/login/reset',
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

                    var User = request.server.plugins['hapi-mongo-models'].User;
                    var conditions = {
                        email: request.payload.email,
                        'resetPassword.expires': { $gt: Date.now() }
                    };

                    User.findOne(conditions, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        if (!user) {
                            return reply({ message: 'Invalid email or key.' }).takeover().code(400);
                        }

                        reply(user);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;

            Async.auto({
                keyMatch: function (done) {

                    var key = request.payload.key;
                    var token = request.pre.user.resetPassword.token;
                    Bcrypt.compare(key, token, done);
                },
                passwordHash: ['keyMatch', function (done, results) {

                    if (!results.keyMatch) {
                        return reply({ message: 'Invalid email or key.' }).takeover().code(400);
                    }

                    User.generatePasswordHash(request.payload.password, done);
                }],
                user: ['passwordHash', function (done, results) {

                    var id = request.pre.user._id.toString();
                    var update = {
                        $set: {
                            password: results.passwordHash.hash
                        },
                        $unset: {
                            resetPassword: undefined
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }]
            }, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'login'
};
