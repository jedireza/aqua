'use strict';
const Async = require('async');
const Boom = require('boom');
const Config = require('../config');


const internals = {};


internals.applyStrategy = function (server, next) {

    server.auth.strategy('session', 'cookie', {
        password: Config.get('/cookieSecret'),
        cookie: 'sid-aqua',
        isSecure: false,
        redirectTo: '/login',
        validateFunc: function (request, data, callback) {

            const Session = request.getDb('aqua').getModel('Session');
            const User = request.getDb('aqua').getModel('User');

            Async.auto({
                session: function (done) {

                    const id = data.session.id;
                    const key = data.session.key;
                    if ( id.indexOf('-') < 0){
                        done();
                    }
                    Session.findByCredentials(id, key, done);
                },
                user: ['session', function (results, done) {

                    if (!results.session) {
                        return done();
                    }
                    User.findById(results.session.userId).then(
                        (user) => {

                            done(null, user);
                        },
                        (err) => {

                            done(err);
                        }
                    );
                }],
                roles: ['user', function (results, done) {

                    if (!results.user) {
                        return done();
                    }

                    results.user.hydrateRoles(request.getDb('aqua'),done);
                }],
                scope: ['roles', function (results, done) {

                    if (!results.user || !results.user.roles) {
                        return done();
                    }
                    done(null, Object.keys(results.user.roles));
                }]
            }, (err, results) => {

                if (err) {
                    return callback(err);
                }

                if (!results.session) {
                    return callback(null, false);
                }

                callback(null, Boolean(results.user), results);
            });
        }
    });


    next();
};


internals.preware = {
    ensureNotRoot: {
        assign: 'ensureNotRoot',
        method: function (request, reply) {

            if (request.auth.credentials.user.username === 'root') {
                const message = 'Not permitted for root user.';

                return reply(Boom.badRequest(message));
            }

            reply();
        }
    },
    ensureAdminGroup: function (groups) {

        return {
            assign: 'ensureAdminGroup',
            method: function (request, reply) {

                if (Object.prototype.toString.call(groups) !== '[object Array]') {
                    groups = [groups];
                }
                const models  = request.getDb('aqua').getModels();
                const admin = request.auth.credentials.roles.admin;

                (function next(i){

                    if ( groups.length > i ){
                        admin.isMemberOf(models,groups[i], (err, isMember) => {

                            if (err){
                                return reply(Boom.badRequest(err));
                            }
                            if ( isMember ){
                                reply();
                            }
                            else {
                                next( i + 1);
                            }
                        });

                    }
                    else {
                        const message = `Missing admin group membership to [${groups.join(' or ')}].`;
                        return reply(Boom.badRequest(message));
                    }
                }(0));
            }
        };
    }
};


exports.register = function (server, options, next) {

    server.dependency(['hapi-sequelize','dbconfig'],internals.applyStrategy);

    next();
};


exports.preware = internals.preware;


exports.register.attributes = {
    name: 'auth'
};
