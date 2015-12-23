var React = require('react');
var ReactDOM = require('react-dom');
var CreateMemoryHistory = require('history').createMemoryHistory;
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var TestLocation = CreateMemoryHistory();
var lab = exports.lab = Lab.script();
var stub = {
    RedirectActions: {
        saveReturnUrl: function () {}
    },
    ReactRouter: {
        HistoryLocation: TestLocation
    }
};
var App = Proxyquire('../../../../client/pages/account/index.jsx', {
    '../../actions/Redirect': stub.RedirectActions,
    'react-router': stub.ReactRouter
});
var mountNode;


lab.beforeEach(function (done) {

    TestLocation.history = ['/account'];
    done();
});


lab.before(function (done) {

    mountNode = global.document.createElement('div');
    mountNode.id = 'app-mount';
    global.document.body.appendChild(mountNode);

    done();
});


lab.after(function (done) {

    ReactDOM.unmountComponentAtNode(mountNode);
    global.document.body.removeChild(mountNode);
    delete global.window.app;

    done();
});


lab.experiment('Account App', function () {

    lab.test('it renders normally', function (done) {

        App.blastoff();

        Code.expect(App.mainElement).to.be.an.object();
        done();
    });
});
