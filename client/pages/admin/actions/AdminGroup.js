/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('../constants/AdminGroup');
var Fetch = require('../../../helpers/jsonFetch');


var VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
var SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
var Types = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;


var Actions = {
    getResults: function (data) {

        dispatch(VIEW_ACTION, Types.GET_RESULTS, data);

        var request = {
            method: 'GET',
            url: '/api/admin-groups',
            query: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.GET_RESULTS_RESPONSE, response);
        });
    },
    getDetails: function (data) {

        dispatch(VIEW_ACTION, Types.GET_DETAILS, data);

        var request = {
            method: 'GET',
            url: '/api/admin-groups/' + data.id,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (err) {
                response.fetchFailure = true;
                response.error = err.message;
            }

            dispatch(SERVER_ACTION, Types.GET_DETAILS_RESPONSE, response);
        });
    },
    showCreateNew: function (data) {

        dispatch(VIEW_ACTION, Types.SHOW_CREATE_NEW, data);
    },
    hideCreateNew: function (data) {

        dispatch(VIEW_ACTION, Types.HIDE_CREATE_NEW, data);
    },
    createNew: function (data, router) {

        dispatch(VIEW_ACTION, Types.CREATE_NEW, data);

        var request = {
            method: 'POST',
            url: '/api/admin-groups',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    Actions.getResults(router.getCurrentQuery());
                }
            }

            dispatch(SERVER_ACTION, Types.CREATE_NEW_RESPONSE, response);
        });
    },
    saveDetails: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_DETAILS, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'PUT',
            url: '/api/admin-groups/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_DETAILS_RESPONSE, response);
        });
    },
    savePermissions: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_PERMISSIONS, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'PUT',
            url: '/api/admin-groups/' + id + '/permissions',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_PERMISSIONS_RESPONSE, response);
        });
    },
    delete: function (data, router) {

        dispatch(VIEW_ACTION, Types.DELETE, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'DELETE',
            url: '/api/admin-groups/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    router.transitionTo('adminGroups');
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.DELETE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
