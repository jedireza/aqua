exports.register = function (plugin, options, next) {

    plugin.route({
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
