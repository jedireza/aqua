'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../../helpers/parse-validation');


const initialState = {
    show: false,
    loading: false,
    error: undefined,
    hasError: {},
    help: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.CREATE_NEW) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.CREATE_NEW_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        });
    }

    if (action.type === Constants.SHOW_CREATE_NEW) {
        return ObjectAssign({}, state, {
            show: true
        });
    }

    if (action.type === Constants.HIDE_CREATE_NEW) {
        return ObjectAssign({}, state, {
            show: false
        });
    }

    return state;
};


module.exports = reducer;
