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
var Form = Proxyquire('../../../../../../client/pages/admin/components/accounts/NoteForm', {
    '../../actions/Account': stub.Actions
});
var mockProps;


lab.beforeEach(function (done) {

    mockProps = {
        details: {
            notes: []
        },
        data: {
            name: {},
            hasError: {},
            help: {}
        }
    };

    done();
});


lab.experiment('Admin Account Note Form', function () {

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


    lab.test('it renders when notes is undefined', function (done) {

        mockProps.details.hydrated = true;
        delete mockProps.details.notes;

        var FormEl = React.createElement(Form, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it renders when notes has items', function (done) {

        mockProps.details.hydrated = true;
        mockProps.details.notes = [
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

        stub.Actions.newNote = function () {

            done();
        };

        mockProps.details.hydrated = true;

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
