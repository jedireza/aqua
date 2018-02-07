'use strict';
const Account = require('../models/account');
const Boom = require('boom');
const Config = require('../../config');
const Joi = require('joi');
const Mailer = require('../mailer');
const SerializeError = require('serialize-error');
const Session = require('../models/session');
const User = require('../models/user');


const register = function (server, serverOptions) {

    server.route({
        method: 'POST',
        path: '/api/signup',
        options: {
            auth: false,
            validate: {
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().email().lowercase().required(),
                    username: Joi.string().token().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
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
            }]
        },
        handler: async function (request, h) {

            // create and link account and user documents

            let [account, user] = await Promise.all([
                Account.create(request.payload.name),
                User.create(
                    request.payload.username,
                    request.payload.password,
                    request.payload.email
                )
            ]);

            [account, user] = await Promise.all([
                account.linkUser(`${user._id}`, user.username),
                user.linkAccount(`${account._id}`, account.fullName())
            ]);

            // send welcome email

            const emailOptions = {
                subject: `Your ${Config.get('/projectName')} account`,
                to: {
                    name: request.payload.name,
                    address: request.payload.email
                }
            };

            try {
                await Mailer.sendEmail(emailOptions, 'welcome', request.payload);
            }
            catch (err) {
                request.log(['mailer', 'error'], SerializeError(err));
            }

            // create session

            const userAgent = request.headers['user-agent'];
            const ip = request.remoteAddress;
            const session = await Session.create(`${user._id}`, ip, userAgent);

            // cookie creds

            const creds = {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles
                },
                session
            };

            request.cookieAuth.set(creds);

            return creds;
        }
    });
};


module.exports = {
    name: 'api-signup',
    dependencies: [
        'hapi-mongo-models',
        'hapi-remote-address'
    ],
    register
};
