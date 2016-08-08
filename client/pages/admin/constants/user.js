'use strict';
const FluxConstant = require('flux-constant');
const PayloadSources = require('../../../constants/payload-sources');


module.exports = {
    PayloadSources: PayloadSources,
    ActionTypes: FluxConstant.set([
        'GET_RESULTS',
        'GET_RESULTS_RESPONSE',
        'GET_IDENTITY',
        'GET_IDENTITY_RESPONSE',
        'SHOW_CREATE_NEW',
        'HIDE_CREATE_NEW',
        'CREATE_NEW',
        'CREATE_NEW_RESPONSE',
        'SAVE_IDENTITY',
        'SAVE_IDENTITY_RESPONSE',
        'SAVE_PASSWORD',
        'SAVE_PASSWORD_RESPONSE',
        'DELETE',
        'DELETE_RESPONSE'
    ])
};
