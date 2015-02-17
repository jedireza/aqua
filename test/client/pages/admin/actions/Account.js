var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var FluxConstant = require('flux-constant');
var Constants = require('../../../../../client/pages/admin/constants/Account');


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
var Actions = Proxyquire('../../../../../client/pages/admin/actions/Account', {
    'flux-dispatcher': stub.Dispatcher,
    '../../../helpers/jsonFetch': stub.Fetch
});


lab.experiment('Admin Account Actions', function () {

    lab.test('it handles getResults successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_RESULTS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.getResults({});
    });


    lab.test('it handles getResults when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_RESULTS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.getResults({});
    });


    lab.test('it handles getDetails successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_DETAILS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.getDetails({});
    });


    lab.test('it handles getDetails when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.GET_DETAILS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.getDetails({});
    });


    lab.test('it handles showCreateNew', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SHOW_CREATE_NEW) {
                done();
            }
        };

        Actions.showCreateNew({});
    });


    lab.test('it handles hideCreateNew', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.HIDE_CREATE_NEW) {
                done();
            }
        };

        Actions.hideCreateNew({});
    });


    lab.test('it handles createNew successfully (without caller)', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.CREATE_NEW_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.createNew({});
    });


    lab.test('it handles createNew successfully (with caller)', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.CREATE_NEW_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        var mockCaller = {
            transitionTo: function () {}
        };

        Actions.createNew({}, mockCaller);
    });


    lab.test('it handles createNew when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.CREATE_NEW_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.createNew({});
    });


    lab.test('it handles saveDetails successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_DETAILS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.saveDetails({});
    });


    lab.test('it handles saveDetails when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_DETAILS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.saveDetails({});
    });


    lab.test('it handles linkUser successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LINK_USER_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.linkUser({});
    });


    lab.test('it handles linkUser when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.LINK_USER_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.linkUser({});
    });


    lab.test('it handles unlinkUser successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.UNLINK_USER_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.unlinkUser({});
    });


    lab.test('it handles unlinkUser when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.UNLINK_USER_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.unlinkUser({});
    });


    lab.test('it handles newStatus successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.NEW_STATUS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.newStatus({});
    });


    lab.test('it handles newStatus when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.NEW_STATUS_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.newStatus({});
    });


    lab.test('it handles newNote successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.NEW_NOTE_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.newNote({});
    });


    lab.test('it handles newNote when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.NEW_NOTE_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.newNote({});
    });


    lab.test('it handles delete successfully (without caller)', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.DELETE_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };


        Actions.delete({});
    });


    lab.test('it handles delete successfully (with caller)', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.DELETE_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };


        var mockCaller = {
            transitionTo: function () {}
        };

        Actions.delete({}, mockCaller);
    });


    lab.test('it handles delete when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.DELETE_RESPONSE) {
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.delete({});
    });
});
