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
var Form = Proxyquire('../../../../../../client/pages/admin/components/users/RolesForm', {
    '../../actions/User': stub.Actions
});
var mockProps;


lab.beforeEach(function (done) {

    mockProps = {
        data: {
            hasError: {},
            help: {}
        }
    };

    done();
});


lab.experiment('Admin User Roles Form', function () {

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


    lab.test('it handles rendering when data is hydrated', function (done) {

        mockProps.data.hydrated = true;

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles rendering when roles data is provided', function (done) {

        mockProps.data.hydrated = true;
        mockProps.data.roles = {
            account: {
                id: '1D',
                name: 'Stimpson J. Cat'
            },
            admin: {
                id: '2D',
                name: 'Ren Hoek'
            }
        };

        var FormWithContext = StubRouterContext(Form, {});
        var FormEl = React.createElement(FormWithContext, mockProps);
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });
});
