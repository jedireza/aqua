var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var FluxConstant = require('flux-constant');
var RedirectConstants = require('../../../client/constants/Redirect');


var lab = exports.lab = Lab.script();
var stub = {
    Dispatcher: {
        handleAction: function () {

            stub.Dispatcher.handleAction.guts.apply(null, arguments);
        }
    }
};
var RedirectActions = Proxyquire('../../../client/actions/Redirect', {
    'flux-dispatcher': stub.Dispatcher
});
var ActionTypes = RedirectConstants.ActionTypes;


lab.experiment('Redirect Actions', function () {

    lab.test('it handles saveReturnUrl', function (done) {

        stub.Dispatcher.handleAction.guts = function (type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_RETURN_URL_RESPONSE) {
                done();
            }
        };

        global.window.localStorage = {
            setItem: function () {}
        };

        RedirectActions.saveReturnUrl();
    });


    lab.test('it handles saveReturnUrl when there is a query string', function (done) {

        global.window.location.search = '?space=race';
        global.window.localStorage = {
            setItem: function () {}
        };

        stub.Dispatcher.handleAction.guts = function (type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.SAVE_RETURN_URL_RESPONSE) {
                done();
            }
        };

        RedirectActions.saveReturnUrl();
    });


    lab.test('it handles clearReturnUrl', function (done) {

        stub.Dispatcher.handleAction.guts = function (type, data) {

            Code.expect(type).to.be.an.instanceOf(FluxConstant);

            if (type === ActionTypes.CLEAR_RETURN_URL_RESPONSE) {
                done();
            }
        };

        global.window.localStorage = {
            removeItem: function () {

                return '';
            }
        };

        RedirectActions.clearReturnUrl();
    });
});
