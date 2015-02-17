exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: 'public',
                listing: true
            }
        }
    });


    next();
};


exports.register.attributes = {
    name: 'public'
};
