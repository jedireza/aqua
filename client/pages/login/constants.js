'use strict';
const FluxConstant = require('flux-constant');
const PayloadSources = require('../../constants/payload-sources');


module.exports = {
    PayloadSources: PayloadSources,
    ActionTypes: FluxConstant.set([
        'FORGOT',
        'FORGOT_RESPONSE',
        'LOGIN',
        'LOGIN_RESPONSE',
        'LOGOUT',
        'LOGOUT_RESPONSE',
        'RESET',
        'RESET_RESPONSE'
    ])
};
