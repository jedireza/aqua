'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../../helpers/parse-validation');


const initialState = {
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    hasError: {},
    help: {},
    adminId: undefined,
    id: undefined,
    username: undefined
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const stateUpdates = ObjectAssign({}, initialState);

        stateUpdates.adminId = action.response.id;

        if (action.response.hasOwnProperty('User') && action.response.User !== null) {
            stateUpdates.id = action.response.User.id;
            stateUpdates.username = action.response.User.username;
        }

        return ObjectAssign({}, stateUpdates);
    }

    if (action.type === Constants.LINK_USER) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.LINK_USER_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (action.response.hasOwnProperty('User') && action.response.User !== null) {
            stateUpdates.id = action.response.User.id;
            stateUpdates.username = action.response.User.username;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.UNLINK_USER) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.UNLINK_USER_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            id: undefined,
            username: undefined
        };

        if (action.response.hasOwnProperty('User') && action.response.User !== null) {
            stateUpdates.id = action.response.User.id;
            stateUpdates.username = action.response.User.username;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.HIDE_USER_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
