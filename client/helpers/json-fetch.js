/* global window, document */
'use strict';
const Cookie = require('cookie');
const Qs = require('qs');
const RedirectActions = require('../actions/redirect');
const Xhr = require('xhr');


module.exports = function jsonFetch (options, callback) {

    const cookies = Cookie.parse(document.cookie);
    const config = {
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
            const httpErr = new Error(response.rawRequest.statusText);

            callback(httpErr, JSON.parse(body));
        }
    });
};
