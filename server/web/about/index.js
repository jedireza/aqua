'use strict';


exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/about',
        handler: function (request, reply) {

            reply.view('about/index');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web/about'
};
