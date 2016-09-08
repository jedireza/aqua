'use strict';


const parseReason = function (message) {

    const regexBecause = /because \[(.*?)(\]|$)/;
    let parsedMessage = message;

    if (regexBecause.test(message)) {
        parsedMessage = regexBecause.exec(message)[1];
    }

    if (regexBecause.test(parsedMessage)) {
        parsedMessage = parseReason(parsedMessage);
    }

    return parsedMessage;
};

const parseValidation = function (response) {

    const validation = response && response.validation;
    const message = response && response.message;
    const error = response && response.error;
    const result = {
        error: undefined,
        hasError: {},
        help: {}
    };

    if (validation && validation.keys) {
        const forField = validation.keys.pop();
        const reason = parseReason(message);

        result.hasError[forField] = true;
        result.help[forField] = reason;
    }
    else if (message) {
        result.error = message;
    }
    else if (error) {
        result.error = error;
    }

    return result;
};


module.exports = parseValidation;
