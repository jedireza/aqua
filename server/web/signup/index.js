'use strict';


exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/signup',
        handler: function (request, reply) {

            reply.view('signup/index');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web/signup'
};
