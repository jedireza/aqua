'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    ReturnUrlActions: {},
    xhr: function () {

        stub.xhr.mock.apply(this, arguments);
    }
};
const JsonFetch = Proxyquire('../../../client/helpers/json-fetch', {
    '../actions/return-url': stub.ReturnUrlActions,
    xhr: stub.xhr
});


lab.experiment('JSON Fetch Helper', () => {

    lab.test('it makes a basic GET request', (done) => {

        stub.xhr.mock = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        const options = {
            method: 'GET',
            url: '/blamo'
        };

        const callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it sends a csrf token header if crumb cookie is preset', (done) => {

        global.document.cookie = 'crumb=blamo!';

        stub.xhr.mock = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        const options = {
            method: 'GET',
            url: '/blamo'
        };

        const callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it redirects to login if the x-auth-required header is present', (done) => {

        const windowLocation = global.window.location;

        Object.defineProperty(global.window.location, 'href', {
            configurable: true,
            set: function () {

                global.window.location = windowLocation;

                done();
            }
        });

        stub.xhr.mock = function (options, callback) {

            const response = {
                statusCode: 200,
                headers: {
                    'x-auth-required': true
                }
            };

            callback(null, response, {});
        };

        const saveReturnUrl = stub.ReturnUrlActions.saveReturnUrl;

        stub.ReturnUrlActions.saveReturnUrl = () => {

            stub.ReturnUrlActions.saveReturnUrl = saveReturnUrl;
        };

        const options = {
            method: 'GET',
            url: '/blamo'
        };

        JsonFetch(options, () => {});
    });


    lab.test('it makes a GET request with query data', (done) => {

        stub.xhr.mock = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        const options = {
            method: 'GET',
            url: '/blamo',
            query: { foo: 'bar' }
        };

        const callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it makes a basic POST request', (done) => {

        stub.xhr.mock = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        const options = {
            method: 'POST',
            url: '/blamo',
            data: { foo: 'bar' }
        };

        const callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it makes a request and gets a less than 2xx response', (done) => {

        global.window.localStorage = {
            getItem: function () {

                return '';
            }
        };

        stub.xhr.mock = function (options, callback) {

            const response = {
                statusCode: 100,
                rawRequest: {
                    statusText: 'Continue'
                }
            };

            callback(null, response, '{}');
        };

        const options = {
            url: '/blamo'
        };

        const callback = function (err, response) {

            Code.expect(err).to.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it makes a request and gets a greater than 2xx response', (done) => {

        global.window.localStorage = {
            getItem: function () {

                return '';
            }
        };

        stub.xhr.mock = function (options, callback) {

            const response = {
                statusCode: 404,
                rawRequest: {
                    statusText: 'Not Found'
                }
            };

            callback(null, response, '{}');
        };

        const options = {
            url: '/blamo'
        };

        const callback = function (err, response) {

            Code.expect(err).to.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it handles an xhr error', (done) => {

        global.window.localStorage = {
            getItem: function () {

                return '';
            }
        };

        stub.xhr.mock = function (options, callback) {

            callback(new Error('Blamo'));
        };

        const options = {
            url: '/blamo'
        };

        const callback = function (err, response) {

            Code.expect(err).to.exist();
            done();
        };

        JsonFetch(options, callback);
    });
});
