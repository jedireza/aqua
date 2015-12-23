'use strict';
const FluxConstant = require('flux-constant');
const PayloadSources = require('../../constants/payload-sources');


module.exports = {
    PayloadSources: PayloadSources,
    ActionTypes: FluxConstant.set([
        'GET_ACCOUNT_SETTINGS',
        'GET_ACCOUNT_SETTINGS_RESPONSE',
        'SAVE_ACCOUNT_SETTINGS',
        'SAVE_ACCOUNT_SETTINGS_RESPONSE',
        'GET_USER_SETTINGS',
        'GET_USER_SETTINGS_RESPONSE',
        'SAVE_USER_SETTINGS',
        'SAVE_USER_SETTINGS_RESPONSE',
        'SAVE_PASSWORD_SETTINGS',
        'SAVE_PASSWORD_SETTINGS_RESPONSE'
    ])
};
