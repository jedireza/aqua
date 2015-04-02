var Dispatcher = require('flux-dispatcher');
var FluxStore = require('flux-store');
var Moment = require('moment');
var CloneDeep = require('lodash/lang/cloneDeep');
var Constants = require('../constants/Account');
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
            name: {}
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
            name: {},
            user: {},
            status: {
                current: {},
                log: []
            },
            notes: []
        },
        user: {
            loading: false,
            success: false,
            error: undefined,
            hasError: {},
            help: {}
        },
        status: {
            loading: false,
            success: false,
            error: undefined,
            hasError: {},
            help: {}
        },
        note: {
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
    getDetails: function () {

        return this.state.details;
    },
    getUser: function () {

        return this.state.user;
    },
    getStatus: function () {

        return this.state.status;
    },
    getNote: function () {

        return this.state.note;
    },
    getDelete: function () {

        return this.state.delete;
    },
    reset: function () {

        this.state = {
            results: CloneDeep(this.defaultState.results),
            createNew: CloneDeep(this.defaultState.createNew),
            details: CloneDeep(this.defaultState.details),
            user: CloneDeep(this.defaultState.user),
            status: CloneDeep(this.defaultState.status),
            note: CloneDeep(this.defaultState.note),
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
    resetUser: function () {

        this.state.user = CloneDeep(this.defaultState.user);
    },
    resetStatus: function () {

        this.state.status = CloneDeep(this.defaultState.status);
    },
    resetNote: function () {

        this.state.note = CloneDeep(this.defaultState.note);
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
    convertStatusDetails: function (status) {

        status = status || {};
        status.current = status.current || {};
        status.log = status.log || [];
        status.log.reverse();
        status.log.forEach(function (item, index) {

            status.log[index].moment = Moment(item.timeCreated);
        });

        return status;
    },
    convertNotesDetails: function (notes) {

        notes = notes || [];
        notes.reverse();
        notes.forEach(function (item, index) {

            notes[index].moment = Moment(item.timeCreated);
        });

        return notes;
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
            this.state.details.user = action.data.user;
            this.state.details.status = this.convertStatusDetails(action.data.status);
            this.state.details.notes = this.convertNotesDetails(action.data.notes);
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

        if (ActionTypes.LINK_USER === action.type) {
            this.resetValidationErrors('user');
            this.state.user.loading = true;
            this.emitChange();
        }

        if (ActionTypes.LINK_USER_RESPONSE === action.type) {
            this.state.user.loading = false;
            this.state.user.success = action.data.success;
            this.handleValidationErrors('user', action.data);

            setTimeout(function () {

                this.state.user.success = undefined;
                this.state.user.error = undefined;
                this.emitChange();
            }.bind(this), 2500);

            if (action.data.success) {
                this.resetValidationErrors('user');
                this.state.details.user = action.data.user;
            }

            this.emitChange();
        }

        if (ActionTypes.UNLINK_USER === action.type) {
            this.resetValidationErrors('user');
            this.state.user.loading = true;
            this.emitChange();
        }

        if (ActionTypes.UNLINK_USER_RESPONSE === action.type) {
            this.state.user.loading = false;
            this.state.user.success = action.data.success;
            this.handleValidationErrors('user', action.data);

            setTimeout(function () {

                this.state.user.success = undefined;
                this.state.user.error = undefined;
                this.emitChange();
            }.bind(this), 2500);

            if (action.data.success) {
                this.resetValidationErrors('user');
                this.state.details.user = action.data.user;
            }

            this.emitChange();
        }

        if (ActionTypes.NEW_STATUS === action.type) {
            this.resetValidationErrors('status');
            this.state.status.loading = true;
            this.emitChange();
        }

        if (ActionTypes.NEW_STATUS_RESPONSE === action.type) {
            this.state.status.loading = false;
            this.state.status.success = action.data.success;
            this.handleValidationErrors('status', action.data);

            setTimeout(function () {

                this.state.status.success = undefined;
                this.state.status.error = undefined;
                this.emitChange();
            }.bind(this), 2500);

            if (action.data.success) {
                this.state.details.status = this.convertStatusDetails(action.data.status);
            }

            this.emitChange();
        }

        if (ActionTypes.NEW_NOTE === action.type) {
            this.resetValidationErrors('note');
            this.state.note.loading = true;
            this.emitChange();
        }

        if (ActionTypes.NEW_NOTE_RESPONSE === action.type) {
            this.state.note.loading = false;
            this.state.note.success = action.data.success;
            this.handleValidationErrors('note', action.data);

            setTimeout(function () {

                this.state.note.success = undefined;
                this.state.note.error = undefined;
                this.emitChange();
            }.bind(this), 2500);

            if (action.data.success) {
                this.state.details.notes = this.convertNotesDetails(action.data.notes);
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
