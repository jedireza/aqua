/* global window */
'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static getDetails(id) {

        ApiActions.get(
            `/api/statuses/${id}`,
            undefined,
            Store,
            Constants.GET_DETAILS,
            Constants.GET_DETAILS_RESPONSE
        );
    }

    static saveDetails(id, data) {

        ApiActions.put(
            `/api/statuses/${id}`,
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

    static delete(id, history) {

        ApiActions.delete(
            `/api/statuses/${id}`,
            undefined,
            Store,
            Constants.DELETE,
            Constants.DELETE_RESPONSE,
            (err, response) => {

                if (!err) {
                    history.push('/admin/statuses');

                    window.scrollTo(0, 0);
                }
            }
        );
    }
}


module.exports = Actions;
