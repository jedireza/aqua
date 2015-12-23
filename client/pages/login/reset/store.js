'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../helpers/parse-validation');
const Redux = require('redux');


const initialState = {
    loading: false,
    success: false,
    error: undefined,
    hasError: {},
    help: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.RESET) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.RESET_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            success: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        });
    }

    return state;
};


module.exports = Redux.createStore(reducer);
