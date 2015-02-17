exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/account/{glob*}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            }
        },
        handler: function (request, reply) {

            reply.view('account/index');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web/account'
};
