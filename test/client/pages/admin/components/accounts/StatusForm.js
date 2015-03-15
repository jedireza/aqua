var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');
var Moment = require('moment');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/admin/components/accounts/StatusForm', {
    '../../actions/Account': stub.Actions
});
var mockProps;


lab.beforeEach(function (done) {

    mockProps = {
        details: {
            status: {
                current: {},
                log: []
            }
        },
        list: {
            data: [
                { _id: 'account-happy', name: 'Happy' },
                { _id: 'account-sad', name: 'Sad' }
            ]
        },
        data: {
            name: {},
            hasError: {},
            help: {}
        }
    };

    done();
});


lab.experiment('Admin Account Status Form', function () {

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


    lab.test('it renders when status log is undefined', function (done) {

        mockProps.details.hydrated = true;
        delete mockProps.details.status.log;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it renders when status log has items', function (done) {

        mockProps.details.hydrated = true;
        mockProps.details.status.log = [
            {
                userCreated: {},
                moment: Moment('2014-02-14 17:39:00'),
                timeCreated: '2014-02-14 17:39:00'
            }
        ];

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
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


    lab.test('it handles a submit event', function (done) {

        stub.Actions.newStatus = function () {

            done();
        };

        mockProps.details.hydrated = true;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
        var newMenu = form.refs.newStatus;

        TestUtils.Simulate.change(newMenu.getDOMNode(), {
            target: { value: 'account-happy' }
        });
        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it handles a submit event (when the status is the same)', function (done) {

        mockProps.details.hydrated = true;
        mockProps.details.status.current = {
            id: 'account-happy', name: 'Happy'
        };

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
        var newMenu = form.refs.newStatus;

        var realSetTimeout = setTimeout;
        setTimeout = function (handler) {

            setTimeout = realSetTimeout;
            handler();
            done();
        };

        TestUtils.Simulate.change(newMenu.getDOMNode(), {
            target: { value: 'account-happy' }
        });
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
