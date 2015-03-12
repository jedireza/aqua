var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/admin/components/users/PasswordForm', {
    '../../actions/User': stub.Actions
});
var mockProps;


lab.beforeEach(function (done) {

    mockProps = {
        identity: {},
        data: {
            hasError: {},
            help: {}
        }
    };

    done();
});


lab.experiment('Admin User Password Form', function () {

    lab.test('it renders normally', function (done) {

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var FormEl = React.createElement(Form, mockProps);

        React.render(FormEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it replaces state when receiving new props when hydrated is false', function (done) {

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.identity.hydrated = true;
        form.setProps(mockProps);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.savePassword = function () {

            done();
        };

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it renders with success state', function (done) {

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.data.hydrated = true;
        mockProps.data.success = true;
        form.setProps(mockProps);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.data.hydrated = true;
        mockProps.data.error = 'Whoops.';
        form.setProps(mockProps);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
