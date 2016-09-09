'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showFetchFailure: false,
    showSaveSuccess: false,
    error: undefined,
    hasError: {},
    help: {},
    _id: undefined,
    isActive: undefined,
    username: undefined,
    email: undefined,
    roles: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DETAILS) {
        return ObjectAssign({}, initialState, {
            hydrated: false,
            loading: true
        });
    }

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            hydrated: true,
            loading: false,
            showFetchFailure: !!action.err,
            error: validation.error,
            _id: action.response._id,
            isActive: action.response.isActive,
            username: action.response.username,
            email: action.response.email,
            roles: action.response.roles
        });
    }

    if (action.type === Constants.SAVE_DETAILS) {
        return ObjectAssign({}, state, {
            loading: true,
            isActive: action.request.data.isActive,
            username: action.request.data.username,
            email: action.request.data.email
        });
    }

    if (action.type === Constants.SAVE_DETAILS_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (action.response.hasOwnProperty('username')) {
            stateUpdates.isActive = action.response.isActive;
            stateUpdates.username = action.response.username;
            stateUpdates.email = action.response.email;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.HIDE_DETAILS_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
