/* global window */
'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static resetStore() {

        Store.dispatch({ type: Constants.RESET_STORE });
    }

    static async sendRequest(data) {

        const response = await ApiActions.post(
            '/api/signup',
            data,
            Store,
            Constants.REGISTER,
            Constants.REGISTER_RESPONSE,
        );

        if (response.error) {
            return;
        }

        window.location.href = '/account';
    }
};


module.exports = Actions;
