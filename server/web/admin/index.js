exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/admin/{glob*}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            reply.view('admin/index');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web/admin'
};
