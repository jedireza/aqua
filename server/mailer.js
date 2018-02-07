'use strict';
const Config = require('../config');
const Fs = require('fs');
const Handlebars = require('handlebars');
const Hoek = require('hoek');
const Markdown = require('nodemailer-markdown').markdown;
const Nodemailer = require('nodemailer');
const Path = require('path');
const Util = require('util');


const readFile = Util.promisify(Fs.readFile);


class Mailer {
    static async renderTemplate(signature, context) {

        if (this.templateCache[signature]) {
            return this.templateCache[signature](context);
        }

        const filePath = Path.resolve(__dirname, `./emails/${signature}.hbs.md`);
        const options = { encoding: 'utf-8' };
        const source = await readFile(filePath, options);

        this.templateCache[signature] = Handlebars.compile(source);

        return this.templateCache[signature](context);
    }


    static async sendEmail(options, template, context) {

        const content = await this.renderTemplate(template, context);

        options = Hoek.applyToDefaults(options, {
            from: Config.get('/system/fromAddress'),
            markdown: content
        });

        return await this.transport.sendMail(options);
    }
}


Mailer.templateCache = {};
Mailer.transport = Nodemailer.createTransport(Config.get('/nodemailer'));
Mailer.transport.use('compile', Markdown({ useEmbeddedImages: true }));


module.exports = Mailer;
