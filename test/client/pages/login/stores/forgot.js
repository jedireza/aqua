var Lab = require('lab');
var Code = require('code');
var Dispatcher = require('flux-dispatcher');
var Constants = require('../../../../../client/pages/login/constants');
var Store = require('../../../../../client/pages/login/stores/forgot');


var lab = exports.lab = Lab.script();
var ActionTypes = Constants.ActionTypes;


lab.experiment('Login Forgot Store', function () {

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


    lab.test('it handles a FORGOT action', function (done) {

        Dispatcher.handleAction(ActionTypes.FORGOT, {});

        var state = Store.getState();
        Code.expect(state.loading).to.equal(true);
        Code.expect(state.success).to.equal(false);

        done();
    });


    lab.test('it handles a FORGOT_RESPONSE action (success)', function (done) {

        Dispatcher.handleAction(ActionTypes.FORGOT_RESPONSE, {});

        var state = Store.getState();
        Code.expect(state.loading).to.equal(false);

        done();
    });


    lab.test('it handles a FORGOT_RESPONSE action (validation errors)', function (done) {

        Dispatcher.handleAction(ActionTypes.FORGOT_RESPONSE, {
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


    lab.test('it handles a FORGOT_RESPONSE action (other error)', function (done) {

        Dispatcher.handleAction(ActionTypes.FORGOT_RESPONSE, {
            success: false,
            message: 'something else failed'
        });

        var state = Store.getState();
        Code.expect(state.loading).to.equal(false);
        Code.expect(state.success).to.equal(false);
        Code.expect(state.error).to.equal('something else failed');

        done();
    });
});
