'use strict';
const JsonFetch = require('../helpers/json-fetch');
const ServerValidation = require('../helpers/server-validation');


class Actions {
    static get(url, query, store, requestType, responseType) {

        const request = { method: 'GET', url, query };

        return this.makeRequest(request, store, requestType, responseType);
    }

    static put(url, data, store, requestType, responseType) {

        const request = { method: 'PUT', url, data };

        return this.makeRequest(request, store, requestType, responseType);
    }

    static post(url, data, store, requestType, responseType) {

        const request = { method: 'POST', url, data };

        return this.makeRequest(request, store, requestType, responseType);
    }

    static delete(url, query, store, requestType, responseType) {

        const request = { method: 'DELETE', url, query };

        return this.makeRequest(request, store, requestType, responseType);
    }

    static async makeRequest(request, store, requestType, responseType) {

        store.dispatch({ type: requestType, request });

        const responseAction = { type: responseType };

        try {
            responseAction.data = await JsonFetch(request);
        }
        catch (error) {
            console.warn(`API: ${request.method} ${request.url}:`, error);

            responseAction.error = error;
        }

        responseAction.validation = ServerValidation(responseAction.error);

        store.dispatch(responseAction);

        return responseAction;
    }
}


module.exports = Actions;
