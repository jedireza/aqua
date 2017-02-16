'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    hasError: {},
    help: {},
    first: '',
    middle: '',
    last: ''
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DETAILS) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const validation = ParseValidation(action.response);
        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
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
            stateUpdates.name = action.response.first;
        }
        if (action.response.hasOwnProperty('middle')) {
            stateUpdates.name = action.response.middle;
        }
        if (action.response.hasOwnProperty('last')) {
            stateUpdates.name = action.response.last;
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
