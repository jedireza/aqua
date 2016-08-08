'use strict';
const Dispatcher = require('flux-dispatcher');
const Constants = require('./constants');
const Fetch = require('../../helpers/json-fetch');


const VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
const SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
const Types = Constants.ActionTypes;
const dispatch = Dispatcher.handleAction;


const Actions = {
    getAccountSettings: function (data) {

        dispatch(VIEW_ACTION, Types.GET_ACCOUNT_SETTINGS, data);

        const request = {
            method: 'GET',
            url: '/api/accounts/my',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            dispatch(SERVER_ACTION, Types.GET_ACCOUNT_SETTINGS_RESPONSE, response);
        });
    },
    saveAccountSettings: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_ACCOUNT_SETTINGS, data);

        const request = {
            method: 'PUT',
            url: '/api/accounts/my',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_ACCOUNT_SETTINGS_RESPONSE, response);
        });
    },
    getUserSettings: function (data) {

        dispatch(VIEW_ACTION, Types.GET_USER_SETTINGS, data);

        const request = {
            method: 'GET',
            url: '/api/users/my',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            dispatch(SERVER_ACTION, Types.GET_USER_SETTINGS_RESPONSE, response);
        });
    },
    saveUserSettings: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_USER_SETTINGS, data);

        const request = {
            method: 'PUT',
            url: '/api/users/my',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_USER_SETTINGS_RESPONSE, response);
        });
    },
    savePasswordSettings: function (data) {

        dispatch(VIEW_ACTION, Types.SAVE_PASSWORD_SETTINGS, data);

        if (data.password !== data.passwordConfirm) {
            dispatch(VIEW_ACTION, Types.SAVE_PASSWORD_SETTINGS_RESPONSE, {
                message: 'Passwords do not match.'
            });

            return;
        }

        delete data.passwordConfirm;

        const request = {
            method: 'PUT',
            url: '/api/users/my/password',
            data: data,
            useAuth: true
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.SAVE_PASSWORD_SETTINGS_RESPONSE, response);
        });
    }
};


module.exports = Actions;
