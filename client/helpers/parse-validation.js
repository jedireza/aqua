'use strict';

module.exports = function parseValidation (data) {

    const validation = data.validation;
    const message = data.message;
    const response = {
        error: undefined,
        hasError: {},
        help: {}
    };

    if (validation && validation.keys) {
        const forField = validation.keys.pop();
        const regexBecause = /because \[(.*?)\]/;
        let parsedMessage;

        if (regexBecause.test(message)) {
            parsedMessage = regexBecause.exec(message)[1];
        }

        response.hasError[forField] = true;
        response.help[forField] = parsedMessage;
    }
    else if (message) {
        response.error = message;
    }

    return response;
};
