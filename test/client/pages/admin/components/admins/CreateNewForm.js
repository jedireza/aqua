var React = require('react');
var ReactDOM = require('react-dom');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var StubRouterContext = require('../../../../fixtures/StubRouterContext');


var lab = exports.lab = Lab.script();
var TestUtils = require('react-addons-test-utils');
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/admin/components/admins/CreateNewForm.jsx', {
    '../../actions/Admin': stub.Actions
});
var mockProps;


lab.beforeEach(function (done) {

    var container = global.document.createElement('div');
    mockProps = {
        data: {
            hasError: {},
            help: {}
        }
    };

    done();
});


lab.experiment('Admin Admin Create New Form', function () {

    lab.test('it renders normally', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);

        ReactDOM.render(FormEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it replaces state when receiving new props where show is false', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.data.show = false;

        FormEl = React.createElement(FormWithContext, Object.assign({}, form.props, mockProps));

        form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it focuses when receiving new props where show is true', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = ReactDOM.render(<FormWithContext {...mockProps} />, container);
        var realSetTimeout = setTimeout;

        setTimeout = function (handler) {

            setTimeout = realSetTimeout;

            handler();
            done();
        };

        mockProps.data.show = true;

        FormEl = ReactDOM.render(<FormWithContext {...mockProps} />, container);
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.createNew = function () {

            done();
        };

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(ReactDOM.findDOMNode(formTag));
    });


    lab.test('it renders with success state', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.data.success = true;

        FormEl = React.createElement(FormWithContext, Object.assign({}, form.props, mockProps));

        form = TestUtils.renderIntoDocument(FormEl);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.data.error = 'Whoops.';

        FormEl = React.createElement(FormWithContext, Object.assign({}, form.props, mockProps));

        form = TestUtils.renderIntoDocument(FormEl);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
