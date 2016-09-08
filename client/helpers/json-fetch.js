/* global window, document */
'use strict';
const Cookie = require('cookie');
const Qs = require('qs');
const ReturnUrlActions = require('../actions/return-url');
const Xhr = require('xhr');


const jsonFetch = function (options, callback) {

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

    Xhr(config, (err, response, body) => {

        if (err) {
            return callback(err);
        }

        if (response.statusCode >= 200 && response.statusCode < 300) {
            if (response.headers.hasOwnProperty('x-auth-required')) {
                ReturnUrlActions.saveReturnUrl();

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


window.jsonFetch = jsonFetch;


module.exports = jsonFetch;
