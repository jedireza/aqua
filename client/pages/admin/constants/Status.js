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
        'DELETE',
        'DELETE_RESPONSE'
    ])
};
