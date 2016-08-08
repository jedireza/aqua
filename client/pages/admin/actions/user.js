/* global window */
'use strict';
const Dispatcher = require('flux-dispatcher');
const Constants = require('../constants/user');
const Fetch = require('../../../helpers/json-fetch');


const VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
const SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
const Types = Constants.ActionTypes;
const dispatch = Dispatcher.handleAction;


const Actions = {
    getResults: function (data) {

        dispatch(VIEW_ACTION, Types.GET_RESULTS, data);

        const request = {
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

        const request = {
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
    createNew: function (data, routerHistory) {

        dispatch(VIEW_ACTION, Types.CREATE_NEW, data);

        const request = {
            method: 'POST',
            url: '/api/users',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (routerHistory) {
                    routerHistory.pushState(null, `/admin/users/${response._id}`);
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.CREATE_NEW_RESPONSE, response);
        });
    },
    saveIdentity: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_IDENTITY, data);

        const id = data.id;
        delete data.id;

        const request = {
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

        const id = data.id;
        delete data.id;
        delete data.passwordConfirm;

        const request = {
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
    delete: function (data, routerHistory) {

        dispatch(VIEW_ACTION, Types.DELETE, data);

        const id = data.id;
        delete data.id;

        const request = {
            method: 'DELETE',
            url: '/api/users/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (routerHistory) {
                    routerHistory.pushState(null, '/admin/users');
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.DELETE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
