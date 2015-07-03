var React = require('react/addons');
var RouterTestLocation = require('react-router/lib/locations/TestLocation');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var TestLocation = new RouterTestLocation();
var lab = exports.lab = Lab.script();
var stub = {
    RedirectActions: {
        saveReturnUrl: function () {}
    },
    ReactRouter: {
        HistoryLocation: TestLocation
    }
};
var App = Proxyquire('../../../../client/pages/admin/index', {
    '../../actions/Redirect': stub.RedirectActions,
    'react-router': stub.ReactRouter
});
var mountNode;


lab.beforeEach(function (done) {

    TestLocation.history = ['/admin'];
    done();
});


lab.before(function (done) {

    mountNode = global.document.createElement('div');
    mountNode.id = 'app-mount';
    global.document.body.appendChild(mountNode);

    done();
});


lab.after(function (done) {

    React.unmountComponentAtNode(mountNode);
    global.document.body.removeChild(mountNode);
    delete global.window.app;

    done();
});


lab.experiment('Admin App', function () {

    lab.test('it renders normally', function (done) {

        App.blastoff();

        Code.expect(App.mainElement).to.be.an.object();
        done();
    });
});
