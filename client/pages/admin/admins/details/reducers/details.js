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
    id: undefined,
    name: {}
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
            id: action.response.id,
            first: action.response.first,
            middle: action.response.middle,
            last: action.response.last
        });
    }

    if (action.type === Constants.SAVE_DETAILS) {
        return ObjectAssign({}, state, {
            loading: true,
            first: action.request.data.first,
            middle: action.request.data.middle,
            last: action.request.data.last
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

        if (action.response.hasOwnProperty('first')) {
            stateUpdates.first = action.response.first;
        }
        if (action.response.hasOwnProperty('middle')) {
            stateUpdates.middle = action.response.middle;
        }
        if (action.response.hasOwnProperty('last')) {
            stateUpdates.last = action.response.last;
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
