'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    JsonFetch: function () {

        stub.JsonFetch.mock.apply(null, arguments);
    },
    Store: {

        dispatch: function () {

            stub.Store.dispatch.mock.apply(null, arguments);
        }
    }
};
const Actions = Proxyquire('../../../client/actions/api', {
    '../helpers/json-fetch': stub.JsonFetch
});


lab.experiment('Api Actions', () => {

    const typeReq = 'TYPE_REQ';
    const typeRes = 'TYPE_RES';

    lab.test('it dispatches request and response actions (with callback)', (done) => {

        stub.JsonFetch.mock = function (request, callback) {

            callback(null, {});
        };

        stub.Store.dispatch.mock = function (action) {

            if (action.type === typeReq) {
                Code.expect(action.request).to.exist();
            }

            if (action.type === typeRes) {
                Code.expect(action.err).to.not.exist();
                Code.expect(action.response).to.exist();
            }
        };

        Actions.makeRequest({}, stub.Store, typeReq, typeRes, () => {

            done();
        });
    });


    lab.test('it dispatches request and response actions (without callback)', (done) => {

        stub.JsonFetch.mock = function (request, callback) {

            callback(null, {});
        };

        stub.Store.dispatch.mock = function (action) {

            if (action.type === typeReq) {
                Code.expect(action.request).to.exist();
            }

            if (action.type === typeRes) {
                Code.expect(action.err).to.not.exist();
                Code.expect(action.response).to.exist();

                done();
            }
        };

        Actions.makeRequest({}, stub.Store, typeReq, typeRes);
    });


    lab.test('it makes a GET request with the get function', (done) => {

        const makeRequest = Actions.makeRequest;

        Actions.makeRequest = function (request) {

            Code.expect(request.method).to.equal('GET');
            Code.expect(request.query.foo).to.equal('get');

            Actions.makeRequest = makeRequest;

            done();
        };

        Actions.get('/', { foo: 'get' }, stub.Store, typeReq, typeRes);
    });


    lab.test('it makes a PUT request with the put function', (done) => {

        const makeRequest = Actions.makeRequest;

        Actions.makeRequest = function (request) {

            Code.expect(request.method).to.equal('PUT');
            Code.expect(request.data.foo).to.equal('put');

            Actions.makeRequest = makeRequest;

            done();
        };

        Actions.put('/', { foo: 'put' }, stub.Store, typeReq, typeRes);
    });


    lab.test('it makes a POST request with the post function', (done) => {

        const makeRequest = Actions.makeRequest;

        Actions.makeRequest = function (request) {

            Code.expect(request.method).to.equal('POST');
            Code.expect(request.data.foo).to.equal('post');

            Actions.makeRequest = makeRequest;

            done();
        };

        Actions.post('/', { foo: 'post' }, stub.Store, typeReq, typeRes);
    });


    lab.test('it makes a DELETE request with the delete function', (done) => {

        const makeRequest = Actions.makeRequest;

        Actions.makeRequest = function (request) {

            Code.expect(request.method).to.equal('DELETE');
            Code.expect(request.query.foo).to.equal('delete');

            Actions.makeRequest = makeRequest;

            done();
        };

        Actions.delete('/', { foo: 'delete' }, stub.Store, typeReq, typeRes);
    });
});
