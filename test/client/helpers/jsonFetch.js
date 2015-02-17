var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var stub = {
    RedirectActions: {},
    xhr: function () {

        stub.xhr.guts.apply(this, arguments);
    }
};
var JsonFetch = Proxyquire('../../../client/helpers/jsonFetch', {
    '../actions/Redirect': stub.RedirectActions,
    xhr: stub.xhr
});


lab.experiment('JSON Fetch Helper', function () {

    lab.test('it makes a basic GET request', function (done) {

        stub.xhr.guts = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        var options = {
            method: 'GET',
            url: '/blamo'
        };

        var callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it sends a csrf token header if crumb cookie is preset', function (done) {

        global.document.cookie = 'crumb=blamo!';

        stub.xhr.guts = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        var options = {
            method: 'GET',
            url: '/blamo'
        };

        var callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it redirects to login if the x-auth-required header is present', function (done) {

        stub.xhr.guts = function (options, callback) {

            var data = {
                statusCode: 200,
                headers: {
                    'x-auth-required': true
                }
            };

            callback(null, data, {});
        };

        var options = {
            method: 'GET',
            url: '/blamo'
        };

        stub.RedirectActions.saveReturnUrl = function () {

            done();
        };

        JsonFetch(options, function () {});
    });


    lab.test('it makes a GET request with query data', function (done) {

        stub.xhr.guts = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        var options = {
            method: 'GET',
            url: '/blamo',
            query: { foo: 'bar' }
        };

        var callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it makes a basic POST request', function (done) {

        stub.xhr.guts = function (options, callback) {

            callback(null, { statusCode: 200, headers: {} }, '{}');
        };

        var options = {
            method: 'POST',
            url: '/blamo',
            data: { foo: 'bar' }
        };

        var callback = function (err, response) {

            Code.expect(err).to.not.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it makes a request and gets a less than 2xx response', function (done) {

        global.window.localStorage = {
            getItem: function () {

                return '';
            }
        };

        stub.xhr.guts = function (options, callback) {

            var response = {
                statusCode: 100,
                rawRequest: {
                    statusText: 'Continue'
                }
            };

            callback(null, response, '{}');
        };

        var options = {
            url: '/blamo'
        };

        var callback = function (err, response) {

            Code.expect(err).to.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it makes a request and gets a greater than 2xx response', function (done) {

        global.window.localStorage = {
            getItem: function () {

                return '';
            }
        };

        stub.xhr.guts = function (options, callback) {

            var response = {
                statusCode: 404,
                rawRequest: {
                    statusText: 'Not Found'
                }
            };

            callback(null, response, '{}');
        };

        var options = {
            url: '/blamo'
        };

        var callback = function (err, response) {

            Code.expect(err).to.exist();
            done();
        };

        JsonFetch(options, callback);
    });


    lab.test('it handles an xhr error', function (done) {

        global.window.localStorage = {
            getItem: function () {

                return '';
            }
        };

        stub.xhr.guts = function (options, callback) {

            callback(new Error('Blamo'));
        };

        var options = {
            url: '/blamo'
        };

        var callback = function (err, response) {

            Code.expect(err).to.exist();
            done();
        };

        JsonFetch(options, callback);
    });
});
