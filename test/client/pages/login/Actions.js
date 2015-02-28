var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var FluxConstant = require('flux-constant');
var Constants = require('../../../../client/pages/login/Constants');


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
        saveMe: function () {},
        unloadMe: function () {}
    },
    RedirectActions: {
        clearReturnUrl: function () {}
    }
};
var Actions = Proxyquire('../../../../client/pages/login/Actions', {
    'flux-dispatcher': stub.Dispatcher,
    '../../helpers/jsonFetch': stub.Fetch,
    '../../actions/Me': stub.MeActions,
    '../../actions/Redirect': stub.RedirectActions
});


lab.experiment('Login Actions', function () {

    lab.test('it handles forgot successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.FORGOT_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.forgot({});
    });


    lab.test('it handles forgot when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.FORGOT_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.forgot({});
    });


    lab.test('it handles login successfully (redirect to returnUrl)', function (done) {

        var returnUrl = '/deep/link';

        global.window.localStorage = {
            getItem: function () {

                return returnUrl;
            }
        };

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LOGIN_RESPONSE) {
                Code.expect(global.window.location.href).to.endWith(returnUrl);
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {
                user: {
                    roles: {
                        admin: {}
                    }
                }
            });
        };

        Actions.login({});
    });


    lab.test('it handles login successfully (redirect to admin)', function (done) {

        global.window.localStorage = {
            getItem: function () {

                return undefined;
            }
        };

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LOGIN_RESPONSE) {
                Code.expect(global.window.location.href).to.endWith('/admin');
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {
                user: {
                    roles: {
                        admin: {}
                    }
                }
            });
        };

        Actions.login({});
    });


    lab.test('it handles login successfully (redirect to account)', function (done) {

        global.window.localStorage = {
            getItem: function () {

                return undefined;
            }
        };

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LOGIN_RESPONSE) {
                Code.expect(global.window.location.href).to.endWith('/account');
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {
                user: {
                    roles: {
                        account: {}
                    }
                }
            });
        };

        Actions.login({});
    });


    lab.test('it handles login when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LOGIN_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.login({});
    });


    lab.test('it handles logout successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LOGOUT_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.logout({});
    });


    lab.test('it handles logout when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LOGOUT_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.logout({});
    });


    lab.test('it handles reset successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.RESET_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.reset({});
    });


    lab.test('it handles reset when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.RESET_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.reset({});
    });
});
