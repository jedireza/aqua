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
    options: [],
    groups: {},
    newGroup: ''
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const stateUpdates = ObjectAssign({}, initialState);

        stateUpdates.adminId = action.response._id;
        stateUpdates.options = state.options;

        if (action.response.hasOwnProperty('groups')) {
            stateUpdates.groups = action.response.groups;
        }

        return ObjectAssign({}, stateUpdates);
    }

    if (action.type === Constants.GET_GROUP_OPTIONS_RESPONSE) {
        const stateUpdates = {};

        if (action.response.hasOwnProperty('data')) {
            stateUpdates.options = action.response.data;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.SAVE_GROUPS) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.SAVE_GROUPS_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (action.response.hasOwnProperty('groups')) {
            stateUpdates.groups = action.response.groups;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.HIDE_GROUPS_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
