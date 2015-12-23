/* global window */
'use strict';
const Dispatcher = require('flux-dispatcher');
const Constants = require('./constants');
const Fetch = require('../../helpers/json-fetch');
const RedirectActions = require('../../actions/redirect');


const VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
const SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
const Types = Constants.ActionTypes;
const dispatch = Dispatcher.handleAction;


const Actions = {
    forgot: function (data) {

        dispatch(VIEW_ACTION, Types.FORGOT, data);

        const request = {
            method: 'POST',
            url: '/api/login/forgot',
            data: data
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.FORGOT_RESPONSE, response);
        });
    },
    login: function (data) {

        dispatch(VIEW_ACTION, Types.LOGIN, data);

        const request = {
            method: 'POST',
            url: '/api/login',
            data: data
        };

        Fetch(request, function (err, response) {

            if (!err) {
                const returnUrl = window.localStorage.getItem('returnUrl');

                if (returnUrl) {
                    RedirectActions.clearReturnUrl();
                    window.location.href = returnUrl;
                }
                else if (response.user.roles.admin) {
                    window.location.href = '/admin';
                }
                else {
                    window.location.href = '/account';
                }

                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.LOGIN_RESPONSE, response);
        });
    },
    logout: function (data) {

        dispatch(VIEW_ACTION, Types.LOGOUT, data);

        const request = {
            method: 'DELETE',
            url: '/api/logout',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }
            else {
                response.error = err.message;
            }

            dispatch(SERVER_ACTION, Types.LOGOUT_RESPONSE, response);
        });
    },
    reset: function (data) {

        dispatch(VIEW_ACTION, Types.RESET, data);

        const request = {
            method: 'POST',
            url: '/api/login/reset',
            data: data
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.RESET_RESPONSE, response);
        });
    }
};


module.exports = Actions;
