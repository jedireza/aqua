var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var stub = {
    Actions: {}
};
var Form = Proxyquire('../../../../../../client/pages/account/components/settings/PasswordForm.jsx', {
    '../../Actions': stub.Actions
});
var mockStoreState = {};


lab.beforeEach(function (done) {

    mockStoreState = {
        hasError: {},
        help: {}
    };

    done();
});


lab.experiment('Account Settings Password Form', function () {

    lab.test('it renders normally', function (done) {

        var FormEl = React.createElement(Form, {
            data: mockStoreState
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

        ReactDOM.render(FormEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it handles receiving props with and without the store having success', function (done) {

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);

        FormEl = React.createElement(Form, Object.assign({}, form.props, { data: mockStoreState }));

        form = TestUtils.renderIntoDocument(FormEl);

        mockStoreState.success = true;

        FormEl = React.createElement(Form, Object.assign({}, form.props, { data: mockStoreState }));

        form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles a submit event', function (done) {

        stub.Actions.savePasswordSettings = function () {

            done();
        };

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var formTag = TestUtils.findRenderedDOMComponentWithTag(form, 'form');

        TestUtils.Simulate.submit(formTag);
    });


    lab.test('it renders with loading state', function (done) {

        mockStoreState.loading = true;

        var FormEl = React.createElement(Form, {
            data: mockStoreState
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var button = TestUtils.findRenderedDOMComponentWithTag(form, 'button');

        Code.expect(button.disabled).to.be.true();
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
