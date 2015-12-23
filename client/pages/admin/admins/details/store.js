'use strict';
const Delete = require('./reducers/delete');
const Details = require('./reducers/details');
const Groups = require('./reducers/groups');
const Permissions = require('./reducers/permissions');
const Redux = require('redux');
const User = require('./reducers/user');


module.exports = Redux.createStore(
    Redux.combineReducers({
        delete: Delete,
        details: Details,
        groups: Groups,
        permissions: Permissions,
        user: User
    })
);
