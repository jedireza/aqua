var FluxConstant = require('flux-constant');
var PayloadSources = require('../../constants/PayloadSources');


module.exports = {
    PayloadSources: PayloadSources,
    ActionTypes: FluxConstant.set([
        'SEND_MESSAGE',
        'SEND_MESSAGE_RESPONSE'
    ])
};
