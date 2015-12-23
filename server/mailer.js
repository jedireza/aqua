'use strict';
const Config = require('../config');
const Fs = require('fs');
const Handlebars = require('handlebars');
const Hoek = require('hoek');
const Markdown = require('nodemailer-markdown').markdown;
const Nodemailer = require('nodemailer');


const internals = {};


internals.transport = Nodemailer.createTransport(Config.get('/nodemailer'));
internals.transport.use('compile', Markdown({ useEmbeddedImages: true }));


internals.templateCache = {};


internals.renderTemplate = function (signature, context, callback) {

    if (internals.templateCache[signature]) {
        return callback(null, internals.templateCache[signature](context));
    }

    const filePath = __dirname + '/emails/' + signature + '.hbs.md';
    const options = { encoding: 'utf-8' };

    Fs.readFile(filePath, options, (err, source) => {

        if (err) {
            return callback(err);
        }

        internals.templateCache[signature] = Handlebars.compile(source);
        callback(null, internals.templateCache[signature](context));
    });
};


internals.sendEmail = function (options, template, context, callback) {

    internals.renderTemplate(template, context, (err, content) => {

        if (err) {
            return callback(err);
        }

        options = Hoek.applyToDefaults(options, {
            from: Config.get('/system/fromAddress'),
            markdown: content
        });

        internals.transport.sendMail(options, callback);
    });
};


exports.register = function (server, options, next) {

    server.expose('sendEmail', internals.sendEmail);
    server.expose('transport', internals.transport);

    next();
};


exports.sendEmail = internals.sendEmail;


exports.register.attributes = {
    name: 'mailer'
};
