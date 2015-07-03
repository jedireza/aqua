module.exports = function parseValidation (validation, message) {

    var response = {
        error: undefined,
        hasError: {},
        help: {}
    };

    if (validation && validation.keys) {
        var forField = validation.keys.pop();
        var regexBecause = /because \[(.*?)\]/;

        if (regexBecause.test(message)) {
            message = regexBecause.exec(message)[1];
        }

        response.hasError[forField] = true;
        response.help[forField] = message;
    }
    else if (message) {
        response.error = message;
    }

    return response;
};
