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
        getResults: function () {}
    },
    StatusStore: {}
};
var Search = Proxyquire('../../../../../../client/pages/admin/components/statuses/Search.jsx', {
    '../../actions/Status': stub.Actions,
    '../../stores/Status': stub.StatusStore
});


lab.experiment('Admin Status Search', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});
        var search = TestUtils.renderIntoDocument(SearchEl);

        Code.expect(search).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});

        ReactDOM.render(SearchEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it receives new props', function (done) {

        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});
        var search = TestUtils.renderIntoDocument(SearchEl);

        search.setProps({ foo: 'bar' });

        Code.expect(search).to.exist();
        done();
    });


    lab.test('it handles a store change', function (done) {

        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});

        TestUtils.renderIntoDocument(SearchEl);
        stub.StatusStore.emitChange();

        done();
    });


    lab.test('it handles a filter change (from a submit event)', function (done) {

        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});
        var search = TestUtils.renderIntoDocument(SearchEl);
        var target = TestUtils.findRenderedComponentWithType(search, Search);
        var form = TestUtils.findRenderedDOMComponentWithTag(target.refs.filters, 'form');

        target.transitionTo = function () {};

        TestUtils.Simulate.submit(form.getDOMNode());

        Code.expect(search).to.exist();
        done();
    });


    lab.test('it handles a filter change (from an input event)', function (done) {

        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});
        var search = TestUtils.renderIntoDocument(SearchEl);
        var target = TestUtils.findRenderedComponentWithType(search, Search);
        var selects = TestUtils.scryRenderedDOMComponentsWithTag(target, 'select');
        var limit = selects[selects.length - 1];

        target.transitionTo = function () {};

        TestUtils.Simulate.change(limit, { target: { value: 10 } });

        Code.expect(search).to.exist();
        done();
    });


    lab.test('it handles a page change', function (done) {

        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});
        var search = TestUtils.renderIntoDocument(SearchEl);
        var target = TestUtils.findRenderedComponentWithType(search, Search);

        target.setState({
            results: {
                data: [],
                pages: {
                    current: 2,
                    prev: 1,
                    hasPrev: true,
                    next: 3,
                    hasNext: true,
                    total: 3
                },
                items: {
                    limit: 10,
                    begin: 11,
                    end: 20,
                    total: 30
                }
            }
        });

        var next = target.refs.paging.refs.next;

        target.transitionTo = function () {};

        TestUtils.Simulate.click(next.getDOMNode());

        Code.expect(search).to.exist();
        done();
    });


    lab.test('it handles a create new click', function (done) {

        var ComponentWithContext = StubRouterContext(Search, {});
        var SearchEl = React.createElement(ComponentWithContext, {});
        var search = TestUtils.renderIntoDocument(SearchEl);
        var target = TestUtils.findRenderedComponentWithType(search, Search);
        var createNew = target.refs.createNew;

        TestUtils.Simulate.click(createNew.getDOMNode());

        Code.expect(search).to.exist();
        done();
    });
});
