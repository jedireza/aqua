/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('../constants/Admin');
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
            url: '/api/admins',
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
            url: '/api/admins/' + data.id,
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
            url: '/api/admins',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    router.transitionTo('adminDetails', { id: response._id });
                    window.scrollTo(0, 0);
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
            url: '/api/admins/' + id,
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
    linkUser: function (data) {

        dispatch(VIEW_ACTION, Types.LINK_USER, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'PUT',
            url: '/api/admins/' + id + '/user',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.LINK_USER_RESPONSE, response);
        });
    },
    unlinkUser: function (data) {

        dispatch(VIEW_ACTION, Types.UNLINK_USER, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'DELETE',
            url: '/api/admins/' + id + '/user',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.UNLINK_USER_RESPONSE, response);
        });
    },
    saveGroups: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_GROUPS, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'PUT',
            url: '/api/admins/' + id + '/groups',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_GROUPS_RESPONSE, response);
        });
    },
    savePermissions: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_PERMISSIONS, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'PUT',
            url: '/api/admins/' + id + '/permissions',
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
            url: '/api/admins/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    router.transitionTo('admins');
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.DELETE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
