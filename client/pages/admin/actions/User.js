/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('../constants/User');
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
            url: '/api/users',
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
    getIdentity: function (data) {

        dispatch(VIEW_ACTION, Types.GET_IDENTITY, data);

        var request = {
            method: 'GET',
            url: '/api/users/' + data.id,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (err) {
                response.fetchFailure = true;
                response.error = err.message;
            }

            dispatch(SERVER_ACTION, Types.GET_IDENTITY_RESPONSE, response);
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
            url: '/api/users',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    router.transitionTo('userDetails', { id: response._id });
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.CREATE_NEW_RESPONSE, response);
        });
    },
    saveIdentity: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_IDENTITY, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'PUT',
            url: '/api/users/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_IDENTITY_RESPONSE, response);
        });
    },
    savePassword: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_PASSWORD, data);

        if (data.password !== data.passwordConfirm) {
            dispatch(VIEW_ACTION, Types.SAVE_PASSWORD_RESPONSE, {
                message: 'Passwords do not match.'
            });

            return;
        }

        var id = data.id;
        delete data.id;
        delete data.passwordConfirm;

        var request = {
            method: 'PUT',
            url: '/api/users/' + id + '/password',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_PASSWORD_RESPONSE, response);
        });
    },
    delete: function (data, router) {

        dispatch(VIEW_ACTION, Types.DELETE, data);

        var id = data.id;
        delete data.id;

        var request = {
            method: 'DELETE',
            url: '/api/users/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (router) {
                    router.transitionTo('users');
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.DELETE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
