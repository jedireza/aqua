'use strict';
const Delete = require('./reducers/delete');
const Details = require('./reducers/details');
const Note = require('./reducers/note');
const Redux = require('redux');
const Status = require('./reducers/status');
const User = require('./reducers/user');


module.exports = Redux.createStore(
    Redux.combineReducers({
        delete: Delete,
        details: Details,
        note: Note,
        status: Status,
        user: User
    })
);
