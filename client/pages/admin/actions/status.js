/* global window */
'use strict';
const Dispatcher = require('flux-dispatcher');
const Constants = require('../constants/status');
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
            url: '/api/statuses',
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
            url: '/api/statuses/' + data.id,
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
    createNew: function (data, routerLocation) {

        dispatch(VIEW_ACTION, Types.CREATE_NEW, data);

        const request = {
            method: 'POST',
            url: '/api/statuses',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (routerLocation) {
                    Actions.getResults(routerLocation.query);
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
            url: '/api/statuses/' + id,
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
            url: '/api/statuses/' + id,
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;

                if (routerHistory) {
                    routerHistory.pushState(null, '/admin/statuses');
                    window.scrollTo(0, 0);
                }
            }

            dispatch(SERVER_ACTION, Types.DELETE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
