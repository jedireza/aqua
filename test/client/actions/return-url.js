'use strict';
const Lab = require('lab');
const Jsdom = require('jsdom');
const ReturnUrlActions = require('../../../client/actions/return-url');


const lab = exports.lab = Lab.script();


lab.experiment('Return Url Actions', () => {

    lab.test('it handles saveReturnUrl', (done) => {

        const localStorage = global.window.localStorage;

        global.window.localStorage = {
            setItem: function () {

                global.window.localStorage = localStorage;

                done();
            }
        };

        ReturnUrlActions.saveReturnUrl();
    });


    lab.test('it handles saveReturnUrl when there is a query string', (done) => {

        const url = `${global.window.location}?space=race`;

        Jsdom.changeURL(global.window, url);

        const localStorage = global.window.localStorage;

        global.window.localStorage = {
            setItem: function () {

                global.window.localStorage = localStorage;

                done();
            }
        };

        ReturnUrlActions.saveReturnUrl();
    });


    lab.test('it handles clearReturnUrl', (done) => {

        const location = global.window.location.toString();
        const query = global.window.location.search;
        const url = location.replace(query, '');

        Jsdom.changeURL(global.window, url);

        const localStorage = global.window.localStorage;

        global.window.localStorage = {
            removeItem: function () {

                global.window.localStorage = localStorage;

                done();
            }
        };

        ReturnUrlActions.clearReturnUrl();
    });
});
