'use strict';
const Details = require('./reducers/details');
const Password = require('./reducers/password');
const Redux = require('redux');
const User = require('./reducers/user');


module.exports = Redux.createStore(
    Redux.combineReducers({
        details: Details,
        password: Password,
        user: User
    })
);
