'use strict';
const JsonFetch = require('../helpers/json-fetch');


class Actions {
    static get(url, query, store, typeReq, typeRes, callback) {

        const request = { method: 'GET', url, query };
        this.makeRequest(request, store, typeReq, typeRes, callback);
    }

    static put(url, data, store, typeReq, typeRes, callback) {

        const request = { method: 'PUT', url, data };
        this.makeRequest(request, store, typeReq, typeRes, callback);
    }

    static post(url, data, store, typeReq, typeRes, callback) {

        const request = { method: 'POST', url, data };
        this.makeRequest(request, store, typeReq, typeRes, callback);
    }

    static delete(url, query, store, typeReq, typeRes, callback) {

        const request = { method: 'DELETE', url, query };
        this.makeRequest(request, store, typeReq, typeRes, callback);
    }

    static makeRequest(request, store, typeReq, typeRes, callback) {

        store.dispatch({
            type: typeReq,
            request
        });

        JsonFetch(request, (err, response) => {

            store.dispatch({
                type: typeRes,
                err,
                response
            });

            if (callback) {
                callback(err, response);
            }
        });
    }
}


module.exports = Actions;
