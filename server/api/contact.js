'use strict';
const Config = require('../../config');
const Joi = require('joi');
const Mailer = require('../mailer');
const SerializeError = require('serialize-error');


const register = function (server, serverOptions) {

    server.route({
        method: 'POST',
        path: '/api/contact',
        options: {
            auth: false,
            validate: {
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    message: Joi.string().required()
                }
            }
        },
        handler: async function (request, h) {

            const emailOptions = {
                subject: Config.get('/projectName') + ' contact form',
                to: Config.get('/system/toAddress'),
                replyTo: {
                    name: request.payload.name,
                    address: request.payload.email
                }
            };

            try {
                await Mailer.sendEmail(emailOptions, 'contact', request.payload);
            }
            catch (err) {
                request.log(['mailer', 'error'], SerializeError(err));
            }

            return { message: 'Success.' };
        }
    });
};


module.exports = {
    name: 'api-contact',
    dependencies: [],
    register
};
