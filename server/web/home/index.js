exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            return reply.view('home/index');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web/home'
};
