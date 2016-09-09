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
    name: undefined
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
            name: action.response.name
        });
    }

    if (action.type === Constants.SAVE_DETAILS) {
        return ObjectAssign({}, state, {
            loading: true,
            name: action.request.data.name
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

        if (action.response.hasOwnProperty('name')) {
            stateUpdates.name = action.response.name;
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
