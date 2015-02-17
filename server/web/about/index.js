exports.register = function (plugin, options, next) {

    plugin.route({
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
