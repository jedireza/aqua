var FluxConstant = require('flux-constant');
var PayloadSources = require('../../../constants/PayloadSources');


module.exports = {
    PayloadSources: PayloadSources,
    ActionTypes: FluxConstant.set([
        'GET_RESULTS',
        'GET_RESULTS_RESPONSE',
        'GET_DETAILS',
        'GET_DETAILS_RESPONSE',
        'SHOW_CREATE_NEW',
        'HIDE_CREATE_NEW',
        'CREATE_NEW',
        'CREATE_NEW_RESPONSE',
        'SAVE_DETAILS',
        'SAVE_DETAILS_RESPONSE',
        'LINK_USER',
        'LINK_USER_RESPONSE',
        'UNLINK_USER',
        'UNLINK_USER_RESPONSE',
        'NEW_STATUS',
        'NEW_STATUS_RESPONSE',
        'NEW_NOTE',
        'NEW_NOTE_RESPONSE',
        'DELETE',
        'DELETE_RESPONSE'
    ])
};
