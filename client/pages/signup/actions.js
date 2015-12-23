/* global window */
'use strict';
const Constants = require('./constants');
const Fetch = require('../../helpers/json-fetch');
const ParseValidation = require('../../helpers/parse-validation');
const Store = require('./store');


class Actions {
    static sendRequest (data) {

        Store.dispatch({
            type: Constants.REGISTER,
            data: data
        });

        const request = {
            method: 'POST',
            url: '/api/signup',
            data: data
        };

        Fetch(request, function (err, response) {

            const validation = ParseValidation(response);

            response.success = !err;
            response.error = validation.error;
            response.hasError = validation.hasError,
            response.help = validation.help;

            Store.dispatch({
                type: Constants.REGISTER_RESPONSE,
                data: response
            });

            if (response.success) {
                window.location.href = '/account';
            }
        });
    }
};


module.exports = Actions;
