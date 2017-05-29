'use strict';
const Config = require('../../config');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    server.route({
        method: 'POST',
        path: '/contact',
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    message: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const mailer = server.plugins.mailer;
            const emailOptions = {
                subject: Config.get('/projectName') + ' contact form',
                to: Config.get('/system/toAddress'),
                replyTo: {
                    name: request.payload.name,
                    address: request.payload.email
                }
            };
            const template = 'contact';

            mailer.sendEmail(emailOptions, template, request.payload, (err, info) => {

                if (err) {
                    return reply(err);
                }

                reply({ success: true });
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency('mailer', internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'contact'
};
