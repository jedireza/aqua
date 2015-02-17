var Dispatcher = require('flux-dispatcher');
var FluxStore = require('flux-store');
var CloneDeep = require('lodash/lang/cloneDeep');
var Constants = require('../Constants');


var ActionTypes = Constants.ActionTypes;


var Store = FluxStore.extend({
    dispatcher: Dispatcher,
    state: {},
    defaultState: {
        loading: false,
        success: false,
        error: undefined,
        hasError: {},
        help: {}
    },
    getState: function () {

        return this.state;
    },
    reset: function () {

        this.state = CloneDeep(this.defaultState);
    },
    onDispatcherAction: function (payload) {

        var action = payload.action;

        if (ActionTypes.LOGIN === action.type) {
            this.state.loading = true;
            this.state.success = false;
            this.state.error = undefined;
            this.state.hasError = {};
            this.state.help = {};
            this.emitChange();
        }

        if (ActionTypes.LOGIN_RESPONSE === action.type) {
            this.state.loading = false;
            this.state.success = action.data.success;

            var validation = action.data.validation;
            if (validation && validation.keys) {
                var forField = validation.keys.pop();
                this.state.hasError[forField] = true;
                this.state.help[forField] = action.data.message;
            }
            else if (action.data.message) {
                this.state.error = action.data.message;
            }

            this.emitChange();
        }
    }
});


module.exports = Store;
