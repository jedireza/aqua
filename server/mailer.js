'use strict';

const Hoek = require('hoek');
const Fs = require('fs');
const Handlebars = require('handlebars');
const Nodemailer = require('nodemailer');
const Markdown = require('nodemailer-markdown').markdown;
const Config = require('../config');


const transport = Nodemailer.createTransport(Config.get('/nodemailer'));
transport.use('compile', Markdown({ useEmbeddedImages: true }));


const templateCache = {};


const renderTemplate = function (signature, context, callback) {

    if (templateCache[signature]) {
        return callback(null, templateCache[signature](context));
    }

    const filePath = __dirname + '/emails/' + signature + '.hbs.md';
    const options = { encoding: 'utf-8' };

    Fs.readFile(filePath, options, (err, source) => {

        if (err) {
            return callback(err);
        }

        templateCache[signature] = Handlebars.compile(source);
        callback(null, templateCache[signature](context));
    });
};


const sendEmail = exports.sendEmail = function (options, template, context, callback) {

    renderTemplate(template, context, (err, content) => {

        if (err) {
            return callback(err);
        }

        options = Hoek.applyToDefaults(options, {
            from: Config.get('/system/fromAddress'),
            markdown: content
        });

        transport.sendMail(options, callback);
    });
};


exports.register = function (server, options, next) {

    server.expose('sendEmail', sendEmail);
    server.expose('transport', transport);

    next();
};


exports.register.attributes = {
    name: 'mailer'
};
