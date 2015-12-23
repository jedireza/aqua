/* global window */
'use strict';


class Actions {
    static saveReturnUrl() {

        let returnUrl = window.location.pathname;

        if (window.location.search.length > 0) {
            returnUrl += window.location.search;
        }

        window.localStorage.setItem('returnUrl', returnUrl);
    }

    static clearReturnUrl() {

        window.localStorage.removeItem('returnUrl');
    }
}


module.exports = Actions;
