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
var Form = Proxyquire('../../../../../../client/pages/admin/components/admins/UserForm.jsx', {
    '../../actions/Admin': stub.Actions
});
var mockProps, originalConfirm;


lab.beforeEach(function (done) {

    mockProps = {
        details: {},
        data: {
            name: {},
            hasError: {},
            help: {}
        }
    };

    done();
});


lab.before(function (done) {

    originalConfirm = global.window.confirm;
    done();
});


lab.after(function (done) {

    global.window.confirm = originalConfirm;
    done();
});


lab.experiment('Admin Admin User Form', function () {

    lab.test('it renders normally', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);

        ReactDOM.render(FormEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it updates state when receiving new props when hydrated is false', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;

        FormEl = React.createElement(Form, Object.assign({}, form.props, mockProps));

        form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;

        FormEl = React.createElement(Form, Object.assign({}, form.props, mockProps));

        form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles a submit event (link)', function (done) {

        stub.Actions.linkUser = function () {

            done();
        };

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(ReactDOM.findDOMNode(formTag));
    });


    lab.test('it handles a submit event (unlink)', function (done) {

        stub.Actions.unlinkUser = function () {

            done();
        };

        mockProps.details.user = {};

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(ReactDOM.findDOMNode(formTag));
    });


    lab.test('it prevents event propagation when confirm returns false', function (done) {

        global.window.confirm = function () {

            return false;
        };

        mockProps.details.hydrated = true;
        mockProps.details.user = {};

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var buttonTag = TestUtils.findRenderedDOMComponentWithTag(form, 'button');

        TestUtils.Simulate.click(ReactDOM.findDOMNode(buttonTag), {
            stopPropagation: function () {

                done();
            }
        });
    });


    lab.test('it allows event propagation when confirm returns true', function (done) {

        global.window.confirm = function () {

            done();
            return true;
        };

        mockProps.details.hydrated = true;
        mockProps.details.user = {};

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var buttonTag = TestUtils.findRenderedDOMComponentWithTag(form, 'button');

        TestUtils.Simulate.click(ReactDOM.findDOMNode(buttonTag));
    });


    lab.test('it renders with success state', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;
        mockProps.data.success = true;

        FormEl = React.createElement(Form, Object.assign({}, form.props, mockProps));

        form = TestUtils.renderIntoDocument(FormEl);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;
        mockProps.data.error = 'Whoops.';

        FormEl = React.createElement(Form, Object.assign({}, form.props, mockProps));

        form = TestUtils.renderIntoDocument(FormEl);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
