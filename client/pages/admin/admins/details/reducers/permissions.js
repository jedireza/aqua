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
    permissions: {},
    newPermission: ''
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const stateUpdates = ObjectAssign({}, initialState);

        stateUpdates.adminId = action.response._id;
        stateUpdates.options = state.options;

        if (action.response.hasOwnProperty('permissions')) {
            stateUpdates.permissions = action.response.permissions;
        }

        return ObjectAssign({}, stateUpdates);
    }

    if (action.type === Constants.SAVE_PERMISSIONS) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.SAVE_PERMISSIONS_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (action.response.hasOwnProperty('permissions')) {
            stateUpdates.permissions = action.response.permissions;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.HIDE_PERMISSIONS_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
