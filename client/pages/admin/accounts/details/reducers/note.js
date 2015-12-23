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
    accountId: undefined,
    notes: [],
    newNote: ''
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const stateUpdates = ObjectAssign({}, initialState);

        stateUpdates.accountId = action.response._id;

        if (action.response.hasOwnProperty('notes')) {
            stateUpdates.notes = action.response.notes.reverse();
        }

        return ObjectAssign({}, stateUpdates);
    }

    if (action.type === Constants.NEW_NOTE) {
        return ObjectAssign({}, state, {
            loading: true,
            newNote: action.request.data.newNote
        });
    }

    if (action.type === Constants.NEW_NOTE_RESPONSE) {
        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help
        };

        if (action.response.hasOwnProperty('notes')) {
            stateUpdates.newNote = '';
            stateUpdates.notes = action.response.notes.reverse();
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.HIDE_NOTE_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
