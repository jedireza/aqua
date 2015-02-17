var Hoek = require('hoek');
var Fs = require('fs');
var Handlebars = require('handlebars');
var Nodemailer = require('nodemailer');
var Markdown = require('nodemailer-markdown').markdown;
var Config = require('../config');


var transport = Nodemailer.createTransport(Config.get('/nodemailer'));
    transport.use('compile', Markdown({ useEmbeddedImages: true }));


var templateCache = {};


var renderTemplate = function (signature, context, callback) {

    if (templateCache[signature]) {
        return callback(null, templateCache[signature](context));
    }

    var filePath = __dirname + '/emails/' + signature + '.hbs.md';
    var options = { encoding: 'utf-8' };

    Fs.readFile(filePath, options, function (err, source) {

        if (err) {
            return callback(err);
        }

        templateCache[signature] = Handlebars.compile(source);
        callback(null, templateCache[signature](context));
    });
};


var sendEmail = exports.sendEmail = function(options, template, context, callback) {

    renderTemplate(template, context, function (err, content) {

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
