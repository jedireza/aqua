var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/account/components/settings/AccountForm', {
    '../../Actions': stub.Actions
});
var mockStoreState = {};


lab.beforeEach(function (done) {

    mockStoreState = {
        hydrated: true,
        name: {},
        hasError: {},
        help: {}
    };

    done();
});


lab.experiment('Account Settings Account Form', function () {

    lab.test('it renders normally', function (done) {

        var FormEl = React.createElement(Form, {
            data: {}
        });
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });

        React.render(FormEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles receiving props before and after the store has been hydtrated', function (done) {

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);

        mockStoreState.hydrated = true;

        form.setProps({
            data: mockStoreState
        });

        form.setProps({
            data: mockStoreState
        });

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.saveAccountSettings = function () {

            done();
        };

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(formTag.getDOMNode());
    });


    lab.test('it renders with loading state', function (done) {

        mockStoreState.loading = true;

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var button = TestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.getDOMNode().disabled).to.be.true();
        done();
    });


    lab.test('it renders with success state', function (done) {

        mockStoreState.success = true;

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-success');

        Code.expect(alerts.length).to.equal(1);
        done();
    });


    lab.test('it renders with error state', function (done) {

        mockStoreState.error = 'an error occurred and stuff';

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var alerts = TestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(alerts.length).to.equal(1);
        done();
    });
});
