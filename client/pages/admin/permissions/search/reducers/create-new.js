'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../../helpers/parse-validation');


const initialState = {
    show: false,
    loading: false,
    error: undefined,
    hasError: {},
    help: {},
    name: ''
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.CREATE_NEW) {
        return ObjectAssign({}, state, {
            loading: true,
            name: action.request.data.name
        });
    }

    if (action.type === Constants.CREATE_NEW_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (!validation.error) {
            stateUpdates.name = '';
        }

        return ObjectAssign({}, state, stateUpdates);
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
