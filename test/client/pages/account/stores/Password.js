var Lab = require('lab');
var Code = require('code');
var Dispatcher = require('flux-dispatcher');
var Constants = require('../../../../../client/pages/account/Constants');
var Store = require('../../../../../client/pages/account/stores/Password');


var lab = exports.lab = Lab.script();
var ActionTypes = Constants.ActionTypes;


lab.experiment('Account Password Store', function () {

    lab.test('it returns default state', function (done) {

        Store.reset();

        var state = Store.getState();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.success).to.equal(false);
        Code.expect(state.error).to.equal(undefined);
        Code.expect(state.hasError).to.be.an.object();
        Code.expect(state.help).to.be.an.object();

        done();
    });


    lab.test('it handles a SAVE_PASSWORD_SETTINGS action', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD_SETTINGS, {});

        var state = Store.getState();
        Code.expect(state.loading).to.equal(true);

        done();
    });


    lab.test('it handles a SAVE_PASSWORD_SETTINGS_RESPONSE action (success)', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD_SETTINGS_RESPONSE, {});

        var state = Store.getState();
        Code.expect(state.loading).to.equal(false);

        done();
    });


    lab.test('it handles a SAVE_PASSWORD_SETTINGS_RESPONSE action (validation errors)', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD_SETTINGS_RESPONSE, {
            success: false,
            validation: {
                keys: ['name']
            },
            message: 'name is required'
        });

        var state = Store.getState();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.success).to.equal(false);
        Code.expect(Object.keys(state.hasError).length).to.be.above(0);
        Code.expect(Object.keys(state.help).length).to.be.above(0);

        done();
    });


    lab.test('it handles a SAVE_PASSWORD_SETTINGS_RESPONSE action (other error)', function (done) {

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD_SETTINGS_RESPONSE, {
            success: false,
            message: 'something else failed'
        });

        var state = Store.getState();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.success).to.equal(false);
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it sets a timeout to clear the success field after successful save', function (done) {

        var realSetTimeout = setTimeout;

        setTimeout = function (handler) {

            setTimeout = realSetTimeout;

            handler();

            var state = Store.getState();
            Code.expect(state.success).to.not.exist();

            done();
        };

        Dispatcher.handleAction(ActionTypes.SAVE_PASSWORD_SETTINGS_RESPONSE, {
            success: true
        });
    });
});
