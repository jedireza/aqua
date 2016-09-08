'use strict';
const Account = require('../../../server/models/account');
const User = require('../../../server/models/user');


const user = new User({
    username: 'stimpy',
    roles: {
        account: {
            id: '5250W35',
            name: 'Stimpson J Cat'
        }
    },
    _roles: {
        account: new Account({
            _id: '5250W35',
            name: {
                first: 'Stimpson',
                middle: 'J',
                last: 'Cat'
            }
        })
    }
});


module.exports = {
    user,
    roles: user._roles,
    scope: Object.keys(user.roles)
};
