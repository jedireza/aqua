/* global window */
'use strict';
const Dispatcher = require('flux-dispatcher');
const Constants = require('../constants/redirect');


const ActionTypes = Constants.ActionTypes;
const dispatch = Dispatcher.handleAction;


const Actions = {
    saveReturnUrl: function (data) {

        dispatch(ActionTypes.SAVE_RETURN_URL, data);

        let returnUrl = window.location.pathname;

        if (window.location.search.length > 0) {
            returnUrl += window.location.search;
        }

        window.localStorage.setItem('returnUrl', returnUrl);

        dispatch(ActionTypes.SAVE_RETURN_URL_RESPONSE, data);
    },
    clearReturnUrl: function (data) {

        dispatch(ActionTypes.CLEAR_RETURN_URL, data);

        window.localStorage.removeItem('returnUrl');

        dispatch(ActionTypes.CLEAR_RETURN_URL_RESPONSE, data);
    }
};


module.exports = Actions;
