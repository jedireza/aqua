var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var FluxConstant = require('flux-constant');
var Constants = require('../../../../client/pages/contact/Constants');


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
    }
};
var Actions = Proxyquire('../../../../client/pages/contact/Actions', {
    'flux-dispatcher': stub.Dispatcher,
    '../../helpers/jsonFetch': stub.Fetch
});


lab.experiment('Contact Actions', function () {

    lab.test('it handles sendMessage successfully', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SEND_MESSAGE_RESPONSE) {
                Code.expect(data.success).to.equal(true);
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(null, {});
        };

        Actions.sendMessage({});
    });


    lab.test('it handles sendMessage when xhr fails', function (done) {

        stub.Dispatcher.handleAction.guts = function (source, type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SEND_MESSAGE_RESPONSE) {
                Code.expect(data.success).to.not.exist();
                done();
            }
        };

        stub.Fetch.guts = function (options, callback) {

            Code.expect(options).to.be.an.object();
            Code.expect(callback).to.be.a.function();

            callback(new Error('Blamo'), {});
        };

        Actions.sendMessage({});
    });
});
