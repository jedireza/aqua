'use strict';


const serverValidation = function (error) {

    const validation = {
        error: undefined,
        hasError: {},
        help: {}
    };

    if (!error) {
        return validation;
    }

    validation.error = error.message;

    if (!error.validation) {
        return validation;
    }

    error.validation.forEach((details) => {

        const key = details.path.join('.');

        validation.hasError[key] = true;
        validation.help[key] = details.message;
    });

    return validation;
};


module.exports = serverValidation;
