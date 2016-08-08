var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var FluxConstant = require('flux-constant');
var Constants = require('../../../../client/pages/signup/constants');


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
var Actions = Proxyquire('../../../../client/pages/signup/actions', {
    'flux-dispatcher': stub.Dispatcher,
    '../../helpers/json-fetch': stub.Fetch,
    '../../actions/Me': stub.MeActions
});


lab.experiment('Sign Up Actions', function () {

    lab.test('it handles sendRequest successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.RECEIVE_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.sendRequest({});
    });


    lab.test('it handles sendRequest when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.RECEIVE_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.sendRequest({});
    });
});
