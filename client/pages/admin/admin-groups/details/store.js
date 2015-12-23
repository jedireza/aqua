'use strict';
const Delete = require('./reducers/delete');
const Details = require('./reducers/details');
const Permissions = require('./reducers/permissions');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        delete: Delete,
        details: Details,
        permissions: Permissions
    })
);
