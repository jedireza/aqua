/* global window, document */
var Xhr = require('xhr');
var Qs = require('qs');
var Cookie = require('cookie');
var RedirectActions = require('../actions/Redirect');


module.exports = function jsonFetch (options, callback) {

    var cookies = Cookie.parse(document.cookie);
    var config = {
        url: options.url,
        method: options.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (cookies.crumb) {
        config.headers['X-CSRF-Token'] = cookies.crumb;
    }

    if (options.query) {
        config.url += '?' + Qs.stringify(options.query);
    }

    if (options.data) {
        config.body = JSON.stringify(options.data);
    }

    Xhr(config, function (err, response, body) {

        if (err) {
            callback(err);
        }
        else if (response.statusCode >= 200 && response.statusCode < 300) {
            if (response.headers.hasOwnProperty('x-auth-required')) {
                RedirectActions.saveReturnUrl();
                window.location.href = '/login';
            }
            else {
                callback(null, JSON.parse(body));
            }
        }
        else {
            var httpErr = new Error(response.rawRequest.statusText);
            callback(httpErr, JSON.parse(body));
        }
    });
};
