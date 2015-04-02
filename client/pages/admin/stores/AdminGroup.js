var Dispatcher = require('flux-dispatcher');
var FluxStore = require('flux-store');
var CloneDeep = require('lodash/lang/cloneDeep');
var Constants = require('../constants/AdminGroup');
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
            name: undefined
        },
        details: {
            hydrated: false,
            fetchFailure: false,
            loading: false,
            success: false,
            error: undefined,
            hasError: {},
            help: {},
            _id: undefined,
            name: undefined,
            permissions: {}
        },
        permissions: {
            loading: false,
            success: false,
            error: undefined
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
    getDetails: function () {

        return this.state.details;
    },
    getPermissions: function () {

        return this.state.permissions;
    },
    getDelete: function () {

        return this.state.delete;
    },
    reset: function () {

        this.state = {
            results: CloneDeep(this.defaultState.results),
            createNew: CloneDeep(this.defaultState.createNew),
            details: CloneDeep(this.defaultState.details),
            permissions: CloneDeep(this.defaultState.permissions),
            delete: CloneDeep(this.defaultState.delete)
        };
    },
    resetResults: function () {

        this.state.results = CloneDeep(this.defaultState.results);
    },
    resetCreateNew: function () {

        this.state.createNew = CloneDeep(this.defaultState.createNew);
    },
    resetDetails: function () {

        this.state.details = CloneDeep(this.defaultState.details);
    },
    resetPermissions: function () {

        this.state.permissions = CloneDeep(this.defaultState.permissions);
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

        if (ActionTypes.GET_RESULTS_RESPONSE === action.type) {
            this.state.results.loading = false;
            this.state.results.hydrated = true;
            this.state.results.success = action.data.success;
            this.state.results.data = action.data.data;
            this.state.results.pages = action.data.pages;
            this.state.results.items = action.data.items;
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

        if (ActionTypes.GET_DETAILS === action.type) {
            this.state.details.loading = true;
            this.state.details.hydrated = false;
            this.state.details.success = false;
            this.emitChange();
        }

        if (ActionTypes.GET_DETAILS_RESPONSE === action.type) {
            this.handleValidationErrors('details', action.data);
            this.state.details.loading = false;
            this.state.details.hydrated = true;
            this.state.details.fetchFailure = action.data.fetchFailure;
            this.state.details.success = action.data.success;
            this.state.details._id = action.data._id;
            this.state.details.name = action.data.name;
            this.state.details.permissions = action.data.permissions;
            this.emitChange();
        }

        if (ActionTypes.SAVE_DETAILS === action.type) {
            this.state.details.loading = true;
            this.emitChange();
        }

        if (ActionTypes.SAVE_DETAILS_RESPONSE === action.type) {
            this.state.details.loading = false;
            this.state.details.success = action.data.success;
            this.handleValidationErrors('details', action.data);

            if (action.data.success) {
                setTimeout(function () {

                    this.state.details.success = undefined;
                    this.emitChange();
                }.bind(this), 2500);

                this.resetValidationErrors('details');
                this.state.details.name = action.data.name;
            }

            this.emitChange();
        }

        if (ActionTypes.SAVE_PERMISSIONS === action.type) {
            this.state.permissions.loading = true;
            this.emitChange();
        }

        if (ActionTypes.SAVE_PERMISSIONS_RESPONSE === action.type) {
            this.state.permissions.loading = false;
            this.state.permissions.success = action.data.success;
            this.handleValidationErrors('permissions', action.data);

            if (action.data.success) {
                setTimeout(function () {

                    this.state.permissions.success = undefined;
                    this.emitChange();
                }.bind(this), 2500);

                this.resetValidationErrors('permissions');
                this.state.details.permissions = action.data.permissions;
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
