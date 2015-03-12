var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {},
    AccountStore: {}
};
var Component = Proxyquire('../../../../../../client/pages/account/components/settings/Controller', {
    '../../Actions': stub.Actions,
    '../../stores/Account': stub.AccountStore
});


lab.experiment('Account Home Component', function () {

    lab.test('it renders normally', function (done) {

        stub.Actions.getAccountSettings = function () {};
        stub.Actions.getUserSettings = function () {};

        var ComponentEl = React.createElement(Component, {});
        var component = TestUtils.renderIntoDocument(ComponentEl);

        Code.expect(component).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentEl = React.createElement(Component, {});

        React.render(ComponentEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var container = global.document.createElement('div');
        var ComponentEl = React.createElement(Component, {});

        React.render(ComponentEl, container);

        stub.AccountStore.emitChange();

        done();
    });
});
