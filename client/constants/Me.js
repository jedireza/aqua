var FluxConstant = require('flux-constant');
var PayloadSources = require('./PayloadSources');


module.exports = {
    PayloadSources: PayloadSources,
    ActionTypes: FluxConstant.set([
        'SAVE_ME',
        'SAVE_ME_RESPONSE',
        'LOAD_ME',
        'LOAD_ME_RESPONSE',
        'UNLOAD_ME',
        'UNLOAD_ME_RESPONSE'
    ])
};
