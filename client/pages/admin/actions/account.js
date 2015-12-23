/* global window */
'use strict';
const Dispatcher = require('flux-dispatcher');
const Constants = require('../constants/account');
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

        const request = {
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

        const id = data.id;
        delete data.id;

        const request = {
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

        const id = data.id;
        delete data.id;

        const request = {
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

        const id = data.id;
        delete data.id;

        const request = {
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

        const id = data.id;
        delete data.id;

        const request = {
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
    createNew: function (data, routerHistory) {

        dispatch(VIEW_ACTION, Types.CREATE_NEW, data);

        const request = {
            method: 'POST',
            url: '/api/accounts',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (routerHistory) {
                    routerHistory.pushState(null, `/admin/accounts/${response._id}`);
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.CREATE_NEW_RESPONSE, response);
        });
    },
    saveDetails: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_DETAILS, data);

        const id = data.id;
        delete data.id;

        const request = {
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
    delete: function (data, routerHistory) {

        dispatch(VIEW_ACTION, Types.DELETE, data);

        const id = data.id;
        delete data.id;

        const request = {
            method: 'DELETE',
            url: '/api/accounts/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (routerHistory) {
                    routerHistory.pushState(null, '/admin/accounts');
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.DELETE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
