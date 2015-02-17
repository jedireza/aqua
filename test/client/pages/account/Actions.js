var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var FluxConstant = require('flux-constant');
var Constants = require('../../../../client/pages/account/Constants');


var lab = exports.lab = Lab.script();
var ActionTypes = Constants.ActionTypes;
var stub = {
    Fetch: function () {

        stub.Fetch.guts.apply(null, arguments);
    },
    Dispatcher: {
        handleAction: function () {

            stub.Dispatcher.handleAction.guts.apply(null, arguments);
        }
    },
    MeActions: {
        saveMe: function () {}
    }
};
var Actions = Proxyquire('../../../../client/pages/account/Actions', {
    'flux-dispatcher': stub.Dispatcher,
    '../../helpers/jsonFetch': stub.Fetch,
    '../../actions/Me': stub.MeActions
});


lab.experiment('Account Actions', function () {

    lab.test('it handles getAccountSettings successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_ACCOUNT_SETTINGS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.getAccountSettings({});
    });


    lab.test('it handles getAccountSettings when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_ACCOUNT_SETTINGS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.getAccountSettings({});
    });


    lab.test('it handles saveAccountSettings successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_ACCOUNT_SETTINGS_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.saveAccountSettings({});
    });


    lab.test('it handles saveAccountSettings when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_ACCOUNT_SETTINGS_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.saveAccountSettings({});
    });


    lab.test('it handles getUserSettings successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_USER_SETTINGS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.getUserSettings({});
    });


    lab.test('it handles getUserSettings when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_USER_SETTINGS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.getUserSettings({});
    });


    lab.test('it handles saveUserSettings successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_USER_SETTINGS_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.saveUserSettings({});
    });


    lab.test('it handles saveUserSettings when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_USER_SETTINGS_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.saveUserSettings({});
    });


    lab.test('it handles savePasswordSettings successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_PASSWORD_SETTINGS_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.savePasswordSettings({});
    });


    lab.test('it handles savePasswordSettings when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_PASSWORD_SETTINGS_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.savePasswordSettings({});
    });


    lab.test('it handles savePasswordSettings when passwords do not match', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_PASSWORD_SETTINGS_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        Actions.savePasswordSettings({
            password: 'hi',
            passwordConfirm: 'hey'
        });
    });
});
