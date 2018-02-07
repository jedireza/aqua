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

    static async getUserCreds() {

        if (!global.window) {
            return;
        }

        const response = await ApiActions.get(
            '/api/users/my',
            undefined,
            LoginStore,
            Constants.GET_USER_CREDS,
            Constants.GET_USER_CREDS_RESPONSE,
        );

        if (response.validation.error) {
            return;
        }

        const query = Qs.parse(window.location.search.substring(1));

        if (query.returnUrl) {
            window.location.href = query.returnUrl;
        }
        else if (response.data && response.data.roles) {
            if (response.data.roles.admin) {
                window.location.href = '/admin';
            }
            else {
                window.location.href = '/account';
            }
        }
    }

    static async login(data) {

        const response = await ApiActions.post(
            '/api/login',
            data,
            LoginStore,
            Constants.LOGIN,
            Constants.LOGIN_RESPONSE,
        );

        if (response.validation.error) {
            return;
        }

        const query = Qs.parse(window.location.search.substring(1));

        if (query.returnUrl) {
            window.location.href = query.returnUrl;
        }
        else if (response.data && response.data.user) {
            if (response.data.user.roles.admin) {
                window.location.href = '/admin';
            }
            else {
                window.location.href = '/account';
            }
        }
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

    static resetStore() {

        ForgotStore.dispatch({ type: Constants.RESET_STORE });
        LoginStore.dispatch({ type: Constants.RESET_STORE });
        LogoutStore.dispatch({ type: Constants.RESET_STORE });
        ResetStore.dispatch({ type: Constants.RESET_STORE });
    }
}


module.exports = Actions;
