var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var StubRouterContext = require('../../../../fixtures/StubRouterContext');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/admin/components/accounts/UserForm', {
    '../../actions/Account': stub.Actions
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


lab.experiment('Admin Account User Form', function () {

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

        React.render(FormEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it updates state when receiving new props when hydrated is false', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;
        form.setProps(mockProps);

        mockProps.details.hydrated = true;
        form.setProps(mockProps);

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

        TestUtils.Simulate.submit(formTag.getDOMNode());
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

        TestUtils.Simulate.submit(formTag.getDOMNode());
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

        TestUtils.Simulate.click(buttonTag.getDOMNode(), {
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

        TestUtils.Simulate.click(buttonTag.getDOMNode());
    });


    lab.test('it renders with success state', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;
        mockProps.data.success = true;
        form.setProps(mockProps);

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
        form.setProps(mockProps);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
