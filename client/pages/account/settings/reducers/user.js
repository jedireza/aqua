'use strict';
const Constants = require('../constants');


const initialState = {
    data: {
        email: '',
        username: ''
    },
    hydrated: false,
    loading: false,
    showSaveSuccess: false
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.RESET_STORE) {
        return Object.assign({}, initialState);
    }

    if (action.type === Constants.GET_USER) {
        return Object.assign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_USER_RESPONSE) {
        const responseData = action.data || {};

        return Object.assign({}, state, {
            data: Object.assign({}, state.data, responseData),
            loading: false,
            hydrated: true,
            validation: action.validation
        });
    }

    if (action.type === Constants.SAVE_USER) {
        return Object.assign({}, state, {
            loading: true,
            data: {
                username: action.request.data.username,
                email: action.request.data.email
            }
        });
    }

    if (action.type === Constants.SAVE_USER_RESPONSE) {
        const responseData = action.data || {};

        return Object.assign({}, state, {
            data: Object.assign({}, state.data, responseData),
            hydrated: true,
            loading: false,
            showSaveSuccess: Boolean(action.error) === false,
            validation: action.validation
        });
    }

    return state;
};


module.exports = reducer;
