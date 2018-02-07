'use strict';
const AuthAttempt = require('../models/auth-attempt');
const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Config = require('../../config');
const Joi = require('joi');
const Mailer = require('../mailer');
const Session = require('../models/session');
const User = require('../models/user');


const register = function (server, serverOptions) {

    server.route({
        method: 'POST',
        path: '/api/login',
        options: {
            auth: false,
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            validate: {
                payload: {
                    username: Joi.string().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
                assign: 'abuseDetected',
                method: async function (request, h) {

                    const ip = request.remoteAddress;
                    const username = request.payload.username;
                    const detected = await AuthAttempt.abuseDetected(ip, username);

                    if (detected) {
                        throw Boom.badRequest('Maximum number of auth attempts reached.');
                    }

                    return h.continue;
                }
            }, {
                assign: 'user',
                method: async function (request, h) {

                    const ip = request.remoteAddress;
                    const username = request.payload.username;
                    const password = request.payload.password;
                    const user = await User.findByCredentials(username, password);

                    if (!user) {
                        await AuthAttempt.create(ip, username);

                        throw Boom.badRequest('Credentials are invalid or account is inactive.');
                    }

                    return user;
                }
            }, {
                assign: 'session',
                method: async function (request, h) {

                    const userId = `${request.pre.user._id}`;
                    const ip = request.remoteAddress;
                    const userAgent = request.headers['user-agent'];

                    return await Session.create(userId, ip, userAgent);
                }
            }]
        },
        handler: function (request, h) {

            const creds = {
                user: {
                    _id: request.pre.user._id,
                    username: request.pre.user.username,
                    email: request.pre.user.email,
                    roles: request.pre.user.roles
                },
                session: request.pre.session
            };

            request.cookieAuth.set(creds);

            return creds;
        }
    });


    server.route({
        method: 'POST',
        path: '/api/login/forgot',
        options: {
            auth: false,
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [{
                assign: 'user',
                method: async function (request, h) {

                    const query = { email: request.payload.email };
                    const user = await User.findOne(query);

                    if (!user) {
                        const response = h.response({ message: 'Success.' });

                        return response.takeover();
                    }

                    return user;
                }
            }]
        },
        handler: async function (request, h) {

            // set reset token

            const keyHash = await Session.generateKeyHash();
            const update = {
                $set: {
                    resetPassword: {
                        token: keyHash.hash,
                        expires: Date.now() + 10000000
                    }
                }
            };

            const user = await User.findByIdAndUpdate(request.pre.user._id, update);

            // send email

            const projectName = Config.get('/projectName');
            const emailOptions = {
                subject: `Reset your ${projectName} password`,
                to: request.payload.email
            };
            const template = 'forgot-password';
            const context = {
                baseHref: Config.get('/baseUrl') + '/login/reset',
                email: user.email,
                key: keyHash.key
            };

            await Mailer.sendEmail(emailOptions, template, context);

            return { message: 'Success.' };
        }
    });


    server.route({
        method: 'POST',
        path: '/api/login/reset',
        options: {
            auth: false,
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().required(),
                    key: Joi.string().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
                assign: 'user',
                method: async function (request, h) {

                    const query = {
                        email: request.payload.email,
                        'resetPassword.expires': { $gt: Date.now() }
                    };
                    const user = await User.findOne(query);

                    if (!user) {
                        throw Boom.badRequest('Invalid email or key.');
                    }

                    return user;
                }
            }]
        },
        handler: async function (request, h) {

            // validate reset token

            const key = request.payload.key;
            const token = request.pre.user.resetPassword.token;
            const keyMatch = await Bcrypt.compare(key, token);

            if (!keyMatch) {
                throw Boom.badRequest('Invalid email or key.');
            }

            // update user

            const password = request.payload.password;
            const passwordHash = await User.generatePasswordHash(password);
            const update = {
                $set: {
                    password: passwordHash.hash
                },
                $unset: {
                    resetPassword: undefined
                }
            };

            await User.findByIdAndUpdate(request.pre.user._id, update);

            return { message: 'Success.' };
        }
    });
};


module.exports = {
    name: 'api-login',
    dependencies: [
        'hapi-auth-cookie',
        'hapi-mongo-models',
        'hapi-remote-address'
    ],
    register
};
