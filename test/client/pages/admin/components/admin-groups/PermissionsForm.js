var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/admin/components/admin-groups/PermissionsForm', {
    '../../actions/AdminGroup': stub.Actions
});
var mockProps;


lab.beforeEach(function (done) {

    mockProps = {
        details: {},
        data: {
            hasError: {},
            help: {}
        }
    };

    done();
});


lab.experiment('Admin Admin Group Permissions Form', function () {

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


    lab.test('it updates state when receiving new props when hydrated is false', function (done) {

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;
        form.setProps(mockProps);

        mockProps.details.hydrated = true;
        form.setProps(mockProps);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles creating a new permission (via button click)', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var button = form.refs.newPermissionButton.getDOMNode();
        var input = form.refs.newPermission.getDOMNode();

        form.setState = function () {

            done();
        };

        TestUtils.Simulate.change(input, { target: { value: 'NEW' } });
        TestUtils.Simulate.click(button);
    });


    lab.test('it handles creating a new permission (on enter key, but not another)', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var input = form.refs.newPermission.getDOMNode();

        form.setState = function () {

            delete form.setState;
            done();
        };

        TestUtils.Simulate.change(input, { target: { value: 'NE' } });
        TestUtils.Simulate.keyDown(input, { key: 'W', which: 42 });

        TestUtils.Simulate.change(input, { target: { value: 'NEW' } });
        TestUtils.Simulate.keyDown(input, { key: 'Enter', which: 13 });
    });


    lab.test('it handles creating a new permission that already exists', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var input = form.refs.newPermission.getDOMNode();

        TestUtils.Simulate.change(input, { target: { value: 'NEW' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });

        var realSetTimeout = setTimeout;
        setTimeout = function (handler) {

            setTimeout = realSetTimeout;
            handler();
            done();
        };

        TestUtils.Simulate.change(input, { target: { value: 'NEW' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });
    });


    lab.test('it handles toggling a permission', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var input = form.refs.newPermission.getDOMNode();

        var realSetTimeout = setTimeout;
        setTimeout = function (handler) {

            done();
            setTimeout = realSetTimeout;
        };

        TestUtils.Simulate.change(input, { target: { value: 'NEW' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });

        TestUtils.Simulate.change(input, { target: { value: 'ZED' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });

        TestUtils.Simulate.change(input, { target: { value: 'OLD' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });

        TestUtils.Simulate.change(input, { target: { value: 'zed' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });

        var permissionContainer = form.refs.permissionContainer;
        var toggles = TestUtils.scryRenderedDOMComponentsWithClass(permissionContainer, 'btn-default');

        TestUtils.Simulate.change(input, { target: { value: 'NEW' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });

        TestUtils.Simulate.click(toggles[0].getDOMNode());
    });


    lab.test('it handles deleting a permission', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var input = form.refs.newPermission.getDOMNode();

        TestUtils.Simulate.change(input, { target: { value: 'NEW' } });
        TestUtils.Simulate.keyDown(input, { which: 13 });

        var permissionContainer = form.refs.permissionContainer;
        var deletes = TestUtils.scryRenderedDOMComponentsWithClass(permissionContainer, 'btn-warning');

        TestUtils.Simulate.click(deletes[0].getDOMNode());
        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.savePermissions = function () {

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

        mockProps.details.hydrated = true;
        mockProps.data.success = true;
        form.setProps(mockProps);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        mockProps.details.hydrated = true;
        mockProps.data.error = 'Whoops.';
        form.setProps(mockProps);

        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
