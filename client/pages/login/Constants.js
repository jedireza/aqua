var FluxConstant = require('flux-constant');
var PayloadSources = require('../../constants/PayloadSources');


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
