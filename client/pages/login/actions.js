/* global window */
'use strict';
const ApiActions = require('../../actions/api');
const Constants = require('./constants');
const ReturnUrlActions = require('../../actions/return-url');
const ForgotStore = require('./forgot/store');
const LoginStore = require('./home/store');
const LogoutStore = require('./logout/store');
const ResetStore = require('./reset/store');


class Actions {
    static forgot(data) {

        ApiActions.post(
            '/api/login/forgot',
            data,
            ForgotStore,
            Constants.FORGOT,
            Constants.FORGOT_RESPONSE
        );
    }

    static login(data) {

        ApiActions.post(
            '/api/login',
            data,
            LoginStore,
            Constants.LOGIN,
            Constants.LOGIN_RESPONSE,
            (err, response) => {

                if (!err) {
                    const returnUrl = window.localStorage.getItem('returnUrl');

                    if (returnUrl) {
                        ReturnUrlActions.clearReturnUrl();
                        window.location.href = returnUrl;
                    }
                    else if (response.user.roles.admin) {
                        window.location.href = '/admin';
                    }
                    else {
                        window.location.href = '/account';
                    }
                }
            }
        );
    }

    static logout() {

        ApiActions.delete(
            '/api/logout',
            undefined,
            LogoutStore,
            Constants.LOGOUT,
            Constants.LOGOUT_RESPONSE
        );
    }

    static reset(data) {

        ApiActions.post(
            '/api/login/reset',
            data,
            ResetStore,
            Constants.RESET,
            Constants.RESET_RESPONSE
        );
    }
}


module.exports = Actions;
