'use strict';
const Dispatcher = require('flux-dispatcher');
const FluxStore = require('flux-store');
const CloneDeep = require('lodash/cloneDeep');
const Constants = require('../constants');
const ParseValidation = require('../../../helpers/parse-validation');


const ActionTypes = Constants.ActionTypes;


const Store = FluxStore.extend({
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

        const action = payload.action;

        if (ActionTypes.LOGOUT === action.type) {
            this.state.loading = true;
            this.state.success = false;
            this.state.error = undefined;
            this.state.hasError = {};
            this.state.help = {};
            this.emitChange();
        }

        if (ActionTypes.LOGOUT_RESPONSE === action.type) {
            const validation = ParseValidation(action.data.validation, action.data.message);

            this.state.loading = false;
            this.state.success = action.data.success;
            this.state.hasError = validation.hasError;
            this.state.help = validation.help;
            this.state.error = validation.error;

            this.emitChange();
        }
    }
});


module.exports = Store;
