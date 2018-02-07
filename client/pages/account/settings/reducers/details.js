'use strict';
const Constants = require('../constants');


const initialState = {
    data: {
        name: {
            first: '',
            last: '',
            middle: ''
        }
    },
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    validation: {
        error: undefined,
        hasError: {},
        help: {}
    }
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.RESET_STORE) {
        return Object.assign({}, initialState);
    }

    if (action.type === Constants.GET_DETAILS) {
        return Object.assign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_DETAILS_RESPONSE) {
        const responseData = action.data || {};

        return Object.assign({}, state, {
            data: Object.assign({}, state.data, responseData),
            hydrated: true,
            loading: false,
            validation: action.validation
        });
    }

    if (action.type === Constants.SAVE_DETAILS) {
        return Object.assign({}, state, {
            data: Object.assign({}, state.data, action.request.data),
            loading: true
        });
    }

    if (action.type === Constants.SAVE_DETAILS_RESPONSE) {
        const responseData = action.data || {};

        return Object.assign({}, state, {
            data: Object.assign({}, state.data, responseData),
            loading: false,
            showSaveSuccess: Boolean(action.error) === false,
            validation: action.validation
        });
    }

    return state;
};


module.exports = reducer;
