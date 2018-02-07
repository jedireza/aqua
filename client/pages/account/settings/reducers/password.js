'use strict';
const Constants = require('../constants');


const initialState = {
    data: {
        password: '',
        passwordConfirm: ''
    },
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

    if (action.type === Constants.SAVE_PASSWORD) {
        return Object.assign({}, state, {
            data: {
                password: action.request.data.password,
                passwordConfirm: action.request.data.password
            },
            loading: true
        });
    }

    if (action.type === Constants.SAVE_PASSWORD_RESPONSE) {
        let data = state.data;

        if (Boolean(action.error) === false) {
            data = initialState.data;
        }

        return Object.assign({}, state, {
            data: Object.assign({}, data),
            loading: false,
            showSaveSuccess: Boolean(action.error) === false,
            validation: action.validation
        });
    }

    return state;
};


module.exports = reducer;
