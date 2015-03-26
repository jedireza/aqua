var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var StubRouterContext = require('../../../../fixtures/StubRouterContext');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {
        getDetails: function () {}
    },
    GroupActions: {
        getResults: function () {}
    },
    AdminStore: {},
    AdminGroupStore: {}
};
var Details = Proxyquire('../../../../../../client/pages/admin/components/admins/Details', {
    '../../actions/Admin': stub.Actions,
    '../../actions/AdminGroup': stub.GroupActions,
    '../../stores/Admin': stub.AdminStore,
    '../../stores/AdminGroup': stub.AdminGroupStore
});


lab.experiment('Admin Admin Details', function () {

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

        React.render(DetailsEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles a store change', function (done) {

        var ComponentWithContext = StubRouterContext(Details, {});
        var DetailsEl = React.createElement(ComponentWithContext, {});

        TestUtils.renderIntoDocument(DetailsEl);
        stub.AdminStore.emitChange();

        done();
    });


    lab.test('it handles a fetch error', function (done) {

        var ComponentWithContext = StubRouterContext(Details, {});
        var DetailsEl = React.createElement(ComponentWithContext, {});
        var details = TestUtils.renderIntoDocument(DetailsEl);
        var target = TestUtils.findRenderedComponentWithType(details, Details);

        target.setState({
            details: {
                hydrated: true,
                fetchFailure: true
            }
        });

        var heading = TestUtils.findRenderedDOMComponentWithTag(target, 'h1');

        Code.expect(heading.getDOMNode().textContent).to.match(/Error/);
        done();
    });
});
