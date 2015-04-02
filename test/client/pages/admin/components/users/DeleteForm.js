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
var Form = Proxyquire('../../../../../../client/pages/admin/components/users/DeleteForm', {
    '../../actions/User': stub.Actions
});
var mockProps, originalConfirm;


lab.beforeEach(function (done) {

    mockProps = {
        data: {
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


lab.experiment('Admin User Delete Form', function () {

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


    lab.test('it prevents event propagation when confirm returns false', function (done) {

        global.window.confirm = function () {

            return false;
        };

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        form.setProps({
            details: {
                _id: 'pivot-name'
            }
        });

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

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        form.setProps({
            details: {
                _id: 'pivot-name'
            }
        });

        var buttonTag = TestUtils.findRenderedDOMComponentWithTag(form, 'button');

        TestUtils.Simulate.click(buttonTag.getDOMNode());
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.delete = function () {

            done();
        };

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        form.setProps({
            details: {
                _id: 'pivot-name'
            }
        });

        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it renders with error state', function (done) {

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.data.error = 'Whoops.';
        form.setProps(mockProps);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
