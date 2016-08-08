'use strict';
const FluxConstant = require('flux-constant');
const PayloadSources = require('./payload-sources');


module.exports = {
    PayloadSources: PayloadSources,
    ActionTypes: FluxConstant.set([
        'SAVE_RETURN_URL',
        'SAVE_RETURN_URL_RESPONSE',
        'CLEAR_RETURN_URL',
        'CLEAR_RETURN_URL_RESPONSE'
    ])
};
