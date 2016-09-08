/* global window */
'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const ReactRouter = require('react-router');
const Store = require('./store');


class Actions {
    static getDetails(id) {

        ApiActions.get(
            `/api/users/${id}`,
            undefined,
            Store,
            Constants.GET_DETAILS,
            Constants.GET_DETAILS_RESPONSE
        );
    }

    static saveDetails(id, data) {

        ApiActions.put(
            `/api/users/${id}`,
            data,
            Store,
            Constants.SAVE_DETAILS,
            Constants.SAVE_DETAILS_RESPONSE
        );
    }

    static hideDetailsSaveSuccess() {

        Store.dispatch({
            type: Constants.HIDE_DETAILS_SAVE_SUCCESS
        });
    }

    static savePassword(id, data) {

        if (data.password !== data.passwordConfirm) {
            return Store.dispatch({
                type: Constants.SAVE_PASSWORD_RESPONSE,
                err: new Error('password mismatch'),
                response: {
                    message: 'Passwords do not match.'
                }
            });
        }

        delete data.passwordConfirm;

        ApiActions.put(
            `/api/users/${id}/password`,
            data,
            Store,
            Constants.SAVE_PASSWORD,
            Constants.SAVE_PASSWORD_RESPONSE
        );
    }

    static hidePasswordSaveSuccess() {

        Store.dispatch({
            type: Constants.HIDE_PASSWORD_SAVE_SUCCESS
        });
    }

    static delete(id) {

        ApiActions.delete(
            `/api/users/${id}`,
            undefined,
            Store,
            Constants.DELETE,
            Constants.DELETE_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push('/admin/users');

                    window.scrollTo(0, 0);
                }
            }
        );
    }
}


module.exports = Actions;
