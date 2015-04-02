var Dispatcher = require('flux-dispatcher');
var FluxStore = require('flux-store');
var CloneDeep = require('lodash/lang/cloneDeep');
var Constants = require('../constants/User');
var ParseValidation = require('../../../helpers/parseValidation');


var ActionTypes = Constants.ActionTypes;


var Store = FluxStore.extend({
    dispatcher: Dispatcher,
    state: {},
    defaultState: {
        results: {
            hydrated: false,
            loading: false,
            success: false,
            error: undefined,
            data: [],
            pages: {},
            items: {}
        },
        createNew: {
            show: false,
            loading: false,
            error: undefined,
            hasError: {},
            help: {},
            _id: undefined,
            username: undefined,
            email: undefined,
            password: undefined
        },
        identity: {
            hydrated: false,
            fetchFailure: false,
            loading: false,
            success: false,
            error: undefined,
            hasError: {},
            help: {},
            _id: undefined,
            isActive: undefined,
            username: undefined,
            email: undefined,
            roles: {}
        },
        password: {
            loading: false,
            success: false,
            error: undefined,
            hasError: {},
            help: {}
        },
        delete: {
            loading: false,
            error: undefined
        }
    },
    getState: function () {

        return this.state;
    },
    getResults: function () {

        return this.state.results;
    },
    getCreateNew: function () {

        return this.state.createNew;
    },
    getIdentity: function () {

        return this.state.identity;
    },
    getPassword: function () {

        return this.state.password;
    },
    getDelete: function () {

        return this.state.delete;
    },
    reset: function () {

        this.state = {
            results: CloneDeep(this.defaultState.results),
            createNew: CloneDeep(this.defaultState.createNew),
            identity: CloneDeep(this.defaultState.identity),
            password: CloneDeep(this.defaultState.password),
            delete: CloneDeep(this.defaultState.delete)
        };
    },
    resetResults: function () {

        this.state.results = CloneDeep(this.defaultState.results);
    },
    resetCreateNew: function () {

        this.state.createNew = CloneDeep(this.defaultState.createNew);
    },
    resetIdentity: function () {

        this.state.identity = CloneDeep(this.defaultState.identity);
    },
    resetPassword: function () {

        this.state.password = CloneDeep(this.defaultState.password);
    },
    resetDelete: function () {

        this.state.delete = CloneDeep(this.defaultState.delete);
    },
    resetValidationErrors: function (pivot) {

        this.state[pivot].error = undefined;
        this.state[pivot].hasError = {};
        this.state[pivot].help = {};
    },
    handleValidationErrors: function (pivot, data) {

        var validation = ParseValidation(data.validation, data.message);

        this.state[pivot].hasError = validation.hasError;
        this.state[pivot].help = validation.help;
        this.state[pivot].error = validation.error;
    },
    onDispatcherAction: function (payload) {

        var action = payload.action;

        if (ActionTypes.GET_RESULTS === action.type) {
            this.state.results.loading = true;
            this.state.results.hydrated = false;
            this.state.results.success = false;
            this.emitChange();
        }

        if (ActionTypes.SHOW_CREATE_NEW === action.type) {
            this.resetCreateNew();
            this.state.createNew.show = true;
            this.emitChange();
        }

        if (ActionTypes.HIDE_CREATE_NEW === action.type) {
            this.state.createNew.show = false;
            this.emitChange();
        }

        if (ActionTypes.CREATE_NEW === action.type) {
            this.state.createNew.loading = true;
            this.resetValidationErrors('createNew');
            this.emitChange();
        }

        if (ActionTypes.CREATE_NEW_RESPONSE === action.type) {
            this.state.createNew.loading = false;
            this.handleValidationErrors('createNew', action.data);

            if (action.data.hasOwnProperty('_id')) {
                this.resetCreateNew();
            }

            this.emitChange();
        }

        if (ActionTypes.GET_RESULTS_RESPONSE === action.type) {
            this.state.results.loading = false;
            this.state.results.hydrated = true;
            this.state.results.success = action.data.success;
            this.state.results.data = action.data.data;
            this.state.results.pages = action.data.pages;
            this.state.results.items = action.data.items;
            this.emitChange();
        }

        if (ActionTypes.GET_IDENTITY === action.type) {
            this.state.identity.loading = true;
            this.state.identity.hydrated = false;
            this.state.identity.success = false;
            this.emitChange();
        }

        if (ActionTypes.GET_IDENTITY_RESPONSE === action.type) {
            this.handleValidationErrors('identity', action.data);
            this.state.identity.loading = false;
            this.state.identity.hydrated = true;
            this.state.identity.fetchFailure = action.data.fetchFailure;
            this.state.identity.success = action.data.success;
            this.state.identity._id = action.data._id;
            this.state.identity.isActive = action.data.isActive;
            this.state.identity.username = action.data.username;
            this.state.identity.email = action.data.email;
            this.state.identity.roles = action.data.roles;
            this.emitChange();
        }

        if (ActionTypes.SAVE_IDENTITY === action.type) {
            this.state.identity.loading = true;
            this.emitChange();
        }

        if (ActionTypes.SAVE_IDENTITY_RESPONSE === action.type) {
            this.state.identity.loading = false;
            this.state.identity.success = action.data.success;
            this.handleValidationErrors('identity', action.data);

            if (action.data.success) {
                setTimeout(function () {

                    this.state.identity.success = undefined;
                    this.emitChange();
                }.bind(this), 2500);

                this.resetValidationErrors('identity');
                this.state.identity.isActive = action.data.isActive;
                this.state.identity.username = action.data.username;
                this.state.identity.email = action.data.email;
            }

            this.emitChange();
        }

        if (ActionTypes.SAVE_PASSWORD === action.type) {
            this.state.password.loading = true;
            this.emitChange();
        }

        if (ActionTypes.SAVE_PASSWORD_RESPONSE === action.type) {
            this.state.password.loading = false;
            this.state.password.success = action.data.success;
            this.handleValidationErrors('password', action.data);

            if (action.data.success) {
                setTimeout(function () {

                    this.state.password.success = undefined;
                    this.emitChange();
                }.bind(this), 2500);

                this.resetValidationErrors('password');
            }

            this.emitChange();
        }

        if (ActionTypes.DELETE === action.type) {
            this.state.delete.loading = true;
            this.emitChange();
        }

        if (ActionTypes.DELETE_RESPONSE === action.type) {
            this.state.delete.loading = false;
            this.handleValidationErrors('delete', action.data);

            if (action.data.success) {
                this.resetValidationErrors('delete');
            }
            else {
                setTimeout(function () {

                    this.state.delete.error = undefined;
                    this.emitChange();
                }.bind(this), 2500);
            }

            this.emitChange();
        }
    }
});


module.exports = Store;
