/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('../constants/Account');
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
            url: '/api/accounts',
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
            url: '/api/accounts/' + data.id,
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
    linkUser: function (data) {

        dispatch(VIEW_ACTION, Types.LINK_USER, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'PUT',
            url: '/api/accounts/' + id + '/user',
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
            url: '/api/accounts/' + id + '/user',
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
    newStatus: function (data) {

        dispatch(VIEW_ACTION, Types.NEW_STATUS, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'POST',
            url: '/api/accounts/' + id + '/status',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.NEW_STATUS_RESPONSE, response);
        });
    },
    newNote: function (data) {

        dispatch(VIEW_ACTION, Types.NEW_NOTE, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'POST',
            url: '/api/accounts/' + id + '/notes',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.NEW_NOTE_RESPONSE, response);
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
            url: '/api/accounts',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    router.transitionTo('accountDetails', { id: response._id });
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
            url: '/api/accounts/' + id,
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
    delete: function (data, router) {

        dispatch(VIEW_ACTION, Types.DELETE, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'DELETE',
            url: '/api/accounts/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    router.transitionTo('accounts');
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.DELETE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
