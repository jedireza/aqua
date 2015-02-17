exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/contact',
        handler: function (request, reply) {

            reply.view('contact/index');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web/contact'
};
