/* global window */
'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const ForgotStore = require('./forgot/store');
const LoginStore = require('./home/store');
const LogoutStore = require('./logout/store');
const Qs = require('qs');
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

    static getUserCreds() {

        if (!global.window) {
            return;
        }

        ApiActions.get(
            '/api/users/my',
            undefined,
            LoginStore,
            Constants.GET_USER_CREDS,
            Constants.GET_USER_CREDS_RESPONSE,
            (err, response) => {

                if (!err) {
                    const query = Qs.parse(window.location.search.substring(1));

                    if (query.returnUrl) {
                        window.location.href = query.returnUrl;
                    }
                    else if (response && response.roles) {
                        if (response.roles.admin) {
                            window.location.href = '/admin';
                        }
                        else {
                            window.location.href = '/account';
                        }
                    }
                }
            }
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
                    const query = Qs.parse(window.location.search.substring(1));

                    if (query.returnUrl) {
                        window.location.href = query.returnUrl;
                    }
                    else if (response && response.user) {
                        if (response.user.roles.admin) {
                            window.location.href = '/admin';
                        }
                        else {
                            window.location.href = '/account';
                        }
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
