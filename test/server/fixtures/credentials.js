'use strict';

module.exports = function (sequelize, userId, callback) {

    const User = sequelize.models.User;

    User.findById(userId).then( (user) => {

        user.hydrateRoles(sequelize, (err, roles) => {

            if (err){
                callback(err);
            }

            callback(null, {
                user,
                session: {},
                roles: user.roles,
                scope: Object.keys(user.roles)
            });
        });
    }, (err) => {

        callback(err);
    });

};
