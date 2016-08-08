'use strict';
const Constants = require('./constants');
const ObjectAssign = require('object-assign');
const Redux = require('redux');


const defaultState = {
    loading: false,
    success: false,
    error: undefined,
    hasError: {},
    help: {}
};
const reducer = function (state, action) {

    if (action.type === Constants.SEND_MESSAGE) {
        return ObjectAssign({}, defaultState, {
            loading: true
        });
    }

    if (action.type === Constants.SEND_MESSAGE_RESPONSE) {
        return ObjectAssign({}, defaultState, action.data, {
            loading: false
        });
    }

    return defaultState;
};


module.exports = Redux.createStore(reducer, defaultState);
