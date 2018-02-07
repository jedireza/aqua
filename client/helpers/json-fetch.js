/* global window, document */
'use strict';
const Cookie = require('cookie');
const Qs = require('qs');
const Xhr = require('xhr');


const jsonFetch = function (options) {

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

    return new Promise((resolve, reject) => {

        Xhr(config, (err, response, body) => {

            if (err) {
                return reject(err);
            }

            const xhrState = { err, response, body };

            if (/application\/json/.test(response.headers['content-type'])) {
                try {
                    body = JSON.parse(body);

                    xhrState.body = body;
                }
                catch (parseError) {
                    parseError.xhrState = xhrState;

                    return reject(parseError);
                }
            }

            if (response.statusCode >= 200 && response.statusCode < 300) {
                if (response.headers.hasOwnProperty('x-auth-required')) {
                    if (window.location.pathname === '/login') {
                        return reject(Error('Auth required.'));
                    }

                    let returnUrl = window.location.pathname;

                    if (window.location.search.length > 0) {
                        returnUrl += window.location.search;
                    }

                    returnUrl = encodeURIComponent(returnUrl);

                    window.location.href = `/login?returnUrl=${returnUrl}`;

                    return resolve(body);
                }

                resolve(body);
            }
            else {
                reject(body);
            }
        });
    });
};


if (global.window) {
    window.jsonFetch = jsonFetch;
}


module.exports = jsonFetch;
