'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');


const initialState = {
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    hasError: {},
    help: {},
    password: '',
    passwordConfirm: ''
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.SAVE_PASSWORD) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.SAVE_PASSWORD_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        });
    }

    if (action.type === Constants.HIDE_PASSWORD_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
