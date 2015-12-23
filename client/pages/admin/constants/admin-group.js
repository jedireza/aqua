'use strict';
const FluxConstant = require('flux-constant');
const PayloadSources = require('../../../constants/payload-sources');


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
        'SAVE_PERMISSIONS',
        'SAVE_PERMISSIONS_RESPONSE',
        'DELETE',
        'DELETE_RESPONSE'
    ])
};
