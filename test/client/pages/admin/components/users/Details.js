var React = require('react');
var ReactDOM = require('react-dom');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var StubRouterContext = require('../../../../fixtures/StubRouterContext');


var lab = exports.lab = Lab.script();
var TestUtils = require('react-addons-test-utils');
var stub = {
    Actions: {
        getIdentity: function () {}
    },
    UserStore: {}
};
var Details = Proxyquire('../../../../../../client/pages/admin/components/users/Details.jsx', {
    '../../actions/User': stub.Actions,
    '../../stores/User': stub.UserStore
});


lab.experiment('Admin User Details', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(Details, {});
        var DetailsEl = React.createElement(ComponentWithContext, {});
        var details = TestUtils.renderIntoDocument(DetailsEl);

        Code.expect(details).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentWithContext = StubRouterContext(Details, {});
        var DetailsEl = React.createElement(ComponentWithContext, {});

        ReactDOM.render(DetailsEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var ComponentWithContext = StubRouterContext(Details, {});
        var DetailsEl = React.createElement(ComponentWithContext, {});

        TestUtils.renderIntoDocument(DetailsEl);
        stub.UserStore.emitChange();

        done();
    });


    lab.test('it handles a fetch error', function (done) {

        var ComponentWithContext = StubRouterContext(Details, {});
        var DetailsEl = React.createElement(ComponentWithContext, {});
        var details = TestUtils.renderIntoDocument(DetailsEl);
        var target = TestUtils.findRenderedComponentWithType(details, Details);

        target.setState({
            identity: {
                hydrated: true,
                fetchFailure: true
            }
        });

        var heading = TestUtils.findRenderedDOMComponentWithTag(target, 'h1');

        Code.expect(ReactDOM.findDOMNode(heading).textContent).to.match(/Error/);
        done();
    });
});
