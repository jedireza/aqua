var React = require('react');
var ReactDOM = require('react-dom');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var TestUtils = require('react-addons-test-utils');
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/admin/components/admins/GroupsForm.jsx', {
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

        ReactDOM.render(FormEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it updates state when receiving new props when hydrated is false', function (done) {

        var FormEl = React.createElement(Form, mockProps);
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


    lab.test('it skips creating a new group when none selected', function (done) {

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var select = ReactDOM.findDOMNode(form.refs.newGroup);
        var button = ReactDOM.findDOMNode(form.refs.newGroupButton);

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
        var select = ReactDOM.findDOMNode(form.refs.newGroup);
        var button = ReactDOM.findDOMNode(form.refs.newGroupButton);

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
        var select = ReactDOM.findDOMNode(form.refs.newGroup);
        var button = ReactDOM.findDOMNode(form.refs.newGroupButton);

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
        var select = ReactDOM.findDOMNode(form.refs.newGroup);
        var button = ReactDOM.findDOMNode(form.refs.newGroupButton);

        TestUtils.Simulate.change(select, { target: { value: 'service' } });
        TestUtils.Simulate.click(button);

        TestUtils.Simulate.change(select, { target: { value: 'root' } });
        TestUtils.Simulate.click(button);

        TestUtils.Simulate.change(select, { target: { value: 'sales' } });
        TestUtils.Simulate.click(button);

        var groupContainer = form.refs.groupContainer;
        var deletes = TestUtils.scryRenderedDOMComponentsWithClass(groupContainer, 'btn-warning');

        TestUtils.Simulate.click(ReactDOM.findDOMNode(deletes[0]));
        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.saveGroups = function () {

            done();
        };

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(ReactDOM.findDOMNode(formTag));
    });


    lab.test('it renders with success state', function (done) {

        var FormEl = React.createElement(Form, mockProps);
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

        var FormEl = React.createElement(Form, mockProps);
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
