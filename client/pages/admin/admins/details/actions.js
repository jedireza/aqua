/* global window */
'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const ReactRouter = require('react-router');
const Store = require('./store');


class Actions {
    static getDetails(id) {

        ApiActions.get(
            `/api/admins/${id}`,
            undefined,
            Store,
            Constants.GET_DETAILS,
            Constants.GET_DETAILS_RESPONSE
        );
    }

    static getGroupOptions() {

        ApiActions.get(
            '/api/admin-groups',
            undefined,
            Store,
            Constants.GET_GROUP_OPTIONS,
            Constants.GET_GROUP_OPTIONS_RESPONSE
        );
    }

    static saveDetails(id, data) {

        ApiActions.put(
            `/api/admins/${id}`,
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

    static linkUser(id, data) {

        ApiActions.put(
            `/api/admins/${id}/user`,
            data,
            Store,
            Constants.LINK_USER,
            Constants.LINK_USER_RESPONSE
        );
    }

    static unlinkUser(id) {

        ApiActions.delete(
            `/api/admins/${id}/user`,
            undefined,
            Store,
            Constants.UNLINK_USER,
            Constants.UNLINK_USER_RESPONSE
        );
    }

    static hideUserSaveSuccess() {

        Store.dispatch({
            type: Constants.HIDE_USER_SAVE_SUCCESS
        });
    }

    static saveGroups(id, data) {

        ApiActions.put(
            `/api/admins/${id}/groups`,
            data,
            Store,
            Constants.SAVE_GROUPS,
            Constants.SAVE_GROUPS_RESPONSE
        );
    }

    static hideGroupsSaveSuccess() {

        Store.dispatch({
            type: Constants.HIDE_GROUPS_SAVE_SUCCESS
        });
    }

    static savePermissions(id, data) {

        ApiActions.put(
            `/api/admins/${id}/permissions`,
            data,
            Store,
            Constants.SAVE_PERMISSIONS,
            Constants.SAVE_PERMISSIONS_RESPONSE
        );
    }

    static hidePermissionsSaveSuccess() {

        Store.dispatch({
            type: Constants.HIDE_PERMISSIONS_SAVE_SUCCESS
        });
    }

    static delete(id) {

        ApiActions.delete(
            `/api/admins/${id}`,
            undefined,
            Store,
            Constants.DELETE,
            Constants.DELETE_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push('/admin/admins');

                    window.scrollTo(0, 0);
                }
            }
        );
    }
}


module.exports = Actions;
