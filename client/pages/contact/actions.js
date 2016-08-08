'use strict';
const Constants = require('./constants');
const Fetch = require('../../helpers/json-fetch');
const ParseValidation = require('../../helpers/parse-validation');
const Store = require('./store');


class Actions {
    static sendMessage (data) {

        Store.dispatch({
            type: Constants.SEND_MESSAGE,
            data: data
        });

        const request = {
            method: 'POST',
            url: '/api/contact',
            data: data
        };

        Fetch(request, (err, response) => {

            const validation = ParseValidation(response);

            response.success = !err;
            response.error = validation.error;
            response.hasError = validation.hasError,
            response.help = validation.help;

            Store.dispatch({
                type: Constants.SEND_MESSAGE_RESPONSE,
                data: response
            });
        });
    }
}


module.exports = Actions;
