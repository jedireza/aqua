var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/admin/components/admins/GroupsForm', {
    '../../actions/Admin': stub.Actions
});
var mockProps;


lab.beforeEach(function (done) {

    mockProps = {
        details: {
            groups: {
                root: 'Root',
                sales: 'Sales',
                service: 'Service'
            }
        },
        data: {
            hasError: {},
            help: {}
        },
        list: {
            data: [
                { _id: 'sales', name: 'Sales' },
                { _id: 'service', name: 'Service' },
                { _id: 'root', name: 'Root' }
            ]
        }
    };

    done();
});


lab.experiment('Admin Admin Groups Form', function () {

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


    lab.test('it skips creating a new group when none selected', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var select = form.refs.newGroup.getDOMNode();
        var button = form.refs.newGroupButton.getDOMNode();

        form.setState = function () {

            done();
        };

        TestUtils.Simulate.change(select, { target: { value: '' } });
        TestUtils.Simulate.click(button);
    });


    lab.test('it handles creating a new group (via button click)', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var select = form.refs.newGroup.getDOMNode();
        var button = form.refs.newGroupButton.getDOMNode();

        form.setState = function () {

            done();
        };

        TestUtils.Simulate.change(select, { target: { value: 'sales' } });
        TestUtils.Simulate.click(button);
    });


    lab.test('it handles creating a new group that already exists', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var select = form.refs.newGroup.getDOMNode();
        var button = form.refs.newGroupButton.getDOMNode();

        TestUtils.Simulate.change(select, { target: { value: 'sales' } });
        TestUtils.Simulate.click(button);

        var realSetTimeout = setTimeout;
        setTimeout = function (handler) {

            setTimeout = realSetTimeout;
            handler();
            done();
        };

        TestUtils.Simulate.change(select, { target: { value: 'sales' } });
        TestUtils.Simulate.click(button);
    });


    lab.test('it handles deleting a group', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var select = form.refs.newGroup.getDOMNode();
        var button = form.refs.newGroupButton.getDOMNode();

        TestUtils.Simulate.change(select, { target: { value: 'service' } });
        TestUtils.Simulate.click(button);

        TestUtils.Simulate.change(select, { target: { value: 'root' } });
        TestUtils.Simulate.click(button);

        TestUtils.Simulate.change(select, { target: { value: 'sales' } });
        TestUtils.Simulate.click(button);

        var groupContainer = form.refs.groupContainer;
        var deletes = TestUtils.scryRenderedDOMComponentsWithClass(groupContainer, 'btn-warning');

        TestUtils.Simulate.click(deletes[0].getDOMNode());
        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.saveGroups = function () {

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
