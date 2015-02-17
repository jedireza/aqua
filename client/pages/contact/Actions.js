var Dispatcher = require('flux-dispatcher');
var Constants = require('./Constants');
var Fetch = require('../../helpers/jsonFetch');


var VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
var SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
var ActionTypes = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;


var Actions = {
    sendMessage: function (data) {

        dispatch(VIEW_ACTION, ActionTypes.SEND_MESSAGE, data);

        var request = {
            method: 'POST',
            url: '/api/contact',
            data: data
        };

        Fetch(request, function (err, response) {

            if (!err) {
                response.success = true;
            }

            dispatch(SERVER_ACTION, ActionTypes.SEND_MESSAGE_RESPONSE, response);
        });
    }
};


module.exports = Actions;
