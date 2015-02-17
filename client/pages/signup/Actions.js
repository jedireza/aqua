/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('./Constants');
var Fetch = require('../../helpers/jsonFetch');


var VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
var SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
var Types = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;


var Actions = {
    sendRequest: function (data) {

        dispatch(VIEW_ACTION, Types.SEND_REQUEST, data);

        var request = {
            method: 'POST',
            url: '/api/signup',
            data: data
        };

        Fetch(request, function (err, response) {

            if (!err) {
                window.location.href = '/account';
                response.success = true;
            }

            dispatch(SERVER_ACTION, Types.RECEIVE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
