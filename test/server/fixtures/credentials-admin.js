var User = require('../../../server/models/user');
var Admin = require('../../../server/models/admin');


var user = new User({
    _id: '535HOW35',
    username: 'ren',
    roles: {
        admin: {
            id: '953P150D35',
            name: 'Ren Höek'
        }
    },
    _roles: {
        admin: new Admin({
            _id: '953P150D35',
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                root: 'Root'
            }
        })
    }
});


module.exports = {
    user: user,
    roles: user._roles,
    scope: Object.keys(user.roles)
};
