/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('../constants/Redirect');


var ActionTypes = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;


var Actions = {
    saveReturnUrl: function (data) {

        dispatch(ActionTypes.SAVE_RETURN_URL, data);

        var returnUrl = window.location.pathname;
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
