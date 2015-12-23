'use strict';

const Async = require('async');
const Config = require('../config');


exports.register = function (server, options, next) {

    const Session = server.plugins['hapi-mongo-models'].Session;
    const User = server.plugins['hapi-mongo-models'].User;


    server.auth.strategy('session', 'cookie', {
        password: Config.get('/cookieSecret'),
        cookie: 'sid-aqua',
        isSecure: false,
        redirectTo: '/login',
        validateFunc: function (request, data, callback) {

            Async.auto({
                session: function (done) {

                    const id = data.session._id;
                    const key = data.session.key;
                    Session.findByCredentials(id, key, done);
                },
                user: ['session', function (done, results) {

                    if (!results.session) {
                        return done();
                    }

                    User.findById(results.session.userId, done);
                }],
                roles: ['user', function (done, results) {

                    if (!results.user) {
                        return done();
                    }

                    results.user.hydrateRoles(done);
                }],
                scope: ['user', function (done, results) {

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


exports.preware = {};


exports.preware.ensureAdminGroup = function (groups) {

    return {
        assign: 'ensureAdminGroup',
        method: function (request, reply) {

            if (Object.prototype.toString.call(groups) !== '[object Array]') {
                groups = [groups];
            }

            const groupFound = groups.some((group) => {

                return request.auth.credentials.roles.admin.isMemberOf(group);
            });

            if (!groupFound) {
                const response = {
                    message: 'Permission denied to this resource.'
                };

                return reply(response).takeover().code(403);
            }

            reply();
        }
    };
};


exports.register.attributes = {
    name: 'auth'
};
