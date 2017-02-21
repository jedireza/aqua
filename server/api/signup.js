'use strict';
const Async = require('async');
const Boom = require('boom');
const Config = require('../../config');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    server.route({
        method: 'POST',
        path: '/signup',
        config: {
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
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
                method: function (request, reply) {

                    const User = request.getDb('aqua').getModel('User');

                    const conditions = {
                        username: request.payload.username
                    };
                    User.findOne({
                        where: conditions
                    }).then( (user) => {

                        if ( user ){
                            return reply(Boom.conflict('Username already in use.'));
                        }
                        reply(true);
                    }, (err) => {

                        reply(err);
                    });
                }
            }, {
                assign: 'emailCheck',
                method: function (request, reply) {

                    const User = request.getDb('aqua').getModel('User');
                    const conditions = {
                        email: request.payload.email
                    };

                    User.findOne({
                        where : conditions
                    }).then( (user) => {

                        if ( user ){
                            return reply(Boom.conflict('Email already in use.'));
                        }
                        reply(true);
                    }, (err) => {

                        reply(err);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            const mailer = request.server.plugins.mailer;
            const Account = request.getDb('aqua').getModel('Account');
            const User = request.getDb('aqua').getModel('User');
            const Session = request.getDb('aqua').getModel('Session');

            Async.auto({
                user: function (done) {

                    //const username = request.payload.username;
                    //const password = request.payload.password;
                    //const email = request.payload.email;

                    //User.create(username, password, email, done);
                    User.create({
                        username : request.payload.username,
                        isActive: true,
                        password : request.payload.password,
                        email : request.payload.email
                    }).then( (user) => {

                        done(null, user);
                    }, (err) => {

                        done(err);
                    });
                },
                account: ['user', function (results, done) {

                    const name = Account.parseName(request.payload.name);
                    Account.create({
                        first: name.first,
                        middle: name.middle,
                        last: name.last
                    }).then( (account) => {

                        done(null, account);
                    }, (err) => {

                        return done(err);
                    });

                }],
                linkUser: ['account', function (results, done) {

                    const account = results.account;
                    account.setUser(results.user).then(
                        (accountUpdated) => {

                            return done(null, accountUpdated);
                        },
                        (err) => {

                            done(err);
                        }
                    );
                }],
                welcome: ['linkUser', function (results, done) {

                    const emailOptions = {
                        subject: 'Your ' + Config.get('/projectName') + ' account',
                        to: {
                            name: request.payload.name,
                            address: request.payload.email
                        }
                    };
                    const template = 'welcome';
                    mailer.sendEmail(emailOptions, template, request.payload, (err) => {

                        if (err) {
                            console.warn('sending welcome email failed:', err.stack);
                        }
                        done();
                    });
                }],
                session: ['linkUser', function (results, done) {

                    Session.createNew(results.user.id.toString(), (err, session) => {

                        if (err) {
                            return done(err);
                        }
                        return done(null, session);
                    });
                }]
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }
                const user = results.linkUser;
                const credentials = user.username + ':' + results.session.key;
                const authHeader = 'Basic ' + new Buffer(credentials).toString('base64');
                const result = {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        roles: user.roles
                    },
                    session: results.session,
                    authHeader
                };

                request.cookieAuth.set(result);
                reply(result);
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
    name: 'signup'
};
