var Lab = require('lab');
var Code = require('code');
var Dispatcher = require('flux-dispatcher');
var Constants = require('../../../../../client/pages/admin/constants/User');
var Store = require('../../../../../client/pages/admin/stores/User');


var lab = exports.lab = Lab.script();
var ActionTypes = Constants.ActionTypes;


lab.experiment('Admin User Store', function () {

    lab.test('it returns default state', function (done) {

        Store.reset();

        var state = Store.getState();
        Code.expect(state.results).to.be.an.object();
        Code.expect(state.createNew).to.be.an.object();
        Code.expect(state.identity).to.be.an.object();
        Code.expect(state.delete).to.be.an.object();

        done();
    });


    lab.test('it returns default results state', function (done) {

        Store.resetResults();

        var state = Store.getResults();
        Code.expect(state.hydrated).to.equal(false);
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.success).to.equal(false);
        Code.expect(state.error).to.equal(undefined);
        Code.expect(state.data).to.be.an.array();
        Code.expect(state.pages).to.be.an.object();
        Code.expect(state.items).to.be.an.object();

        done();
    });


    lab.test('it returns default create new state', function (done) {

        Store.resetCreateNew();

        var state = Store.getCreateNew();
        Code.expect(state.show).to.equal(false);
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.error).to.equal(undefined);
        Code.expect(state.hasError).to.be.an.object();
        Code.expect(state.help).to.be.an.object();
        Code.expect(state._id).to.equal(undefined);
        Code.expect(state.pivot).to.equal(undefined);
        Code.expect(state.name).to.equal(undefined);

        done();
    });


    lab.test('it returns default identity state', function (done) {

        Store.resetIdentity();

        var state = Store.getIdentity();
        Code.expect(state.hydrated).to.equal(false);
        Code.expect(state.fetchFailure).to.equal(false);
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.success).to.equal(false);
        Code.expect(state.error).to.equal(undefined);
        Code.expect(state.hasError).to.be.an.object();
        Code.expect(state.help).to.be.an.object();
        Code.expect(state._id).to.equal(undefined);
        Code.expect(state.pivot).to.equal(undefined);
        Code.expect(state.name).to.equal(undefined);

        done();
    });


    lab.test('it returns default password state', function (done) {

        Store.resetPassword();

        var state = Store.getPassword();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.success).to.equal(false);
        Code.expect(state.error).to.equal(undefined);

        done();
    });


    lab.test('it returns default delete state', function (done) {

        Store.resetDelete();

        var state = Store.getDelete();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.error).to.equal(undefined);

        done();
    });


    lab.test('it handles a GET_RESULTS action', function (done) {

        Dispatcher.handleAction(ActionTypes.GET_RESULTS, {});

        var state = Store.getResults();
        Code.expect(state.loading).to.equal(true);
        Code.expect(state.hydrated).to.equal(false);

        done();
    });


    lab.test('it handles a GET_RESULTS_RESPONSE action', function (done) {

        Dispatcher.handleAction(ActionTypes.GET_RESULTS_RESPONSE, {});

        var state = Store.getResults();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.hydrated).to.equal(true);

        done();
    });


    lab.test('it handles a SHOW_CREATE_NEW action', function (done) {

        Dispatcher.handleAction(ActionTypes.SHOW_CREATE_NEW, {});

        var state = Store.getCreateNew();
        Code.expect(state.show).to.equal(true);

        done();
    });


    lab.test('it handles a HIDE_CREATE_NEW action', function (done) {

        Dispatcher.handleAction(ActionTypes.HIDE_CREATE_NEW, {});

        var state = Store.getCreateNew();
        Code.expect(state.show).to.equal(false);

        done();
    });


    lab.test('it handles a CREATE_NEW action', function (done) {

        Dispatcher.handleAction(ActionTypes.CREATE_NEW, {});

        var state = Store.getCreateNew();
        Code.expect(state.loading).to.equal(true);

        done();
    });


    lab.test('it handles a CREATE_NEW_RESPONSE action (success)', function (done) {

        Dispatcher.handleAction(ActionTypes.CREATE_NEW_RESPONSE, {
            _id: 'pivot-status'
        });

        var state = Store.getCreateNew();
        Code.expect(state.loading).to.equal(false);

        done();
    });


    lab.test('it handles a CREATE_NEW_RESPONSE action (failure)', function (done) {

        Dispatcher.handleAction(ActionTypes.CREATE_NEW_RESPONSE, {});

        var state = Store.getCreateNew();
        Code.expect(state.loading).to.equal(false);

        done();
    });


    lab.test('it handles a GET_IDENTITY action', function (done) {

        Dispatcher.handleAction(ActionTypes.GET_IDENTITY, {});

        var state = Store.getIdentity();
        Code.expect(state.loading).to.equal(true);
        Code.expect(state.hydrated).to.equal(false);
        Code.expect(state.success).to.equal(false);

        done();
    });


    lab.test('it handles a GET_IDENTITY_RESPONSE action', function (done) {

        Dispatcher.handleAction(ActionTypes.GET_IDENTITY_RESPONSE, {
            success: true,
            fetchFailure: true,
            _id: '1D',
            username: 'Root'
        });

        var state = Store.getIdentity();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.hydrated).to.equal(true);
        Code.expect(state.fetchFailure).to.equal(true);
        Code.expect(state.success).to.equal(true);
        Code.expect(state._id).to.equal('1D');
        Code.expect(state.username).to.equal('Root');

        done();
    });


    lab.test('it handles a SAVE_IDENTITY action', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_IDENTITY, {});

        var state = Store.getIdentity();
        Code.expect(state.loading).to.equal(true);

        done();
    });


    lab.test('it handles a SAVE_IDENTITY_RESPONSE action (success)', function (done) {

        var realSetTimeout = setTimeout;

        setTimeout = function (handler) {

            setTimeout = realSetTimeout;

            handler();

            var state = Store.getIdentity();
            Code.expect(state.loading).to.equal(false);
            Code.expect(state.success).to.not.exist();

            done();
        };

        Dispatcher.handleAction(ActionTypes.SAVE_IDENTITY_RESPONSE, {
            success: true
        });
    });


    lab.test('it handles a SAVE_IDENTITY_RESPONSE action (failure)', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_IDENTITY_RESPONSE, {});

        var state = Store.getIdentity();
        Code.expect(state.loading).to.equal(false);

        done();
    });


    lab.test('it handles a SAVE_PASSWORD action', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD, {});

        var state = Store.getPassword();
        Code.expect(state.loading).to.equal(true);

        done();
    });


    lab.test('it handles a SAVE_PASSWORD_RESPONSE action (success)', function (done) {

        var realSetTimeout = setTimeout;

        setTimeout = function (handler) {

            setTimeout = realSetTimeout;

            handler();

            var state = Store.getPassword();
            Code.expect(state.loading).to.equal(false);
            Code.expect(state.success).to.not.exist();

            done();
        };

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD_RESPONSE, {
            success: true
        });
    });


    lab.test('it handles a SAVE_PASSWORD_RESPONSE action (failure)', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD_RESPONSE, {});

        var state = Store.getPassword();
        Code.expect(state.loading).to.equal(false);

        done();
    });


    lab.test('it handles a DELETE action', function (done) {

        Dispatcher.handleAction(ActionTypes.DELETE, {});

        var state = Store.getDelete();
        Code.expect(state.loading).to.equal(true);

        done();
    });


    lab.test('it handles a DELETE_RESPONSE action (success)', function (done) {

        Dispatcher.handleAction(ActionTypes.DELETE_RESPONSE, {
            success: true
        });

        var state = Store.getDelete();
        Code.expect(state.loading).to.equal(false);

        done();
    });


    lab.test('it handles a DELETE_RESPONSE action (failure)', function (done) {

        var realSetTimeout = setTimeout;

        setTimeout = function (handler) {

            setTimeout = realSetTimeout;

            handler();

            var state = Store.getIdentity();
            Code.expect(state.loading).to.equal(false);
            Code.expect(state.success).to.not.exist();

            done();
        };

        Dispatcher.handleAction(ActionTypes.DELETE_RESPONSE, {
            success: false
        });
    });


    lab.test('it handles validation errors (validation keys)', function (done) {

        Store.handleValidationErrors('identity', {
            validation: {
                source: 'payload',
                keys: ['username']
            },
            message: 'username is required'
        });

        var state = Store.getIdentity();
        Code.expect(state.hasError.username).to.equal(true);
        Code.expect(state.help.username).to.equal('username is required');

        done();
    });


    lab.test('it handles validation errors (general)', function (done) {

        Store.handleValidationErrors('identity', {
            message: 'something no worky'
        });

        var state = Store.getIdentity();
        Code.expect(state.error).to.equal('something no worky');

        done();
    });
});
