var React = require('react');
var ReactDOM = require('react-dom');
var Lab = require('lab');
var Code = require('code');
var NotFound = require('../../../../../../client/pages/admin/components/not-found/Controller.jsx');
var StubRouterContext = require('../../../../fixtures/StubRouterContext');


var lab = exports.lab = Lab.script();
var TestUtils = require('react-addons-test-utils');


lab.experiment('Login Not Found Component', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(NotFound, {});
        var NotFoundEl = React.createElement(ComponentWithContext, {});
        var notFound = TestUtils.renderIntoDocument(NotFoundEl);

        Code.expect(notFound).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ComponentWithContext = StubRouterContext(NotFound, {});
        var NotFoundEl = React.createElement(ComponentWithContext, {});

        ReactDOM.render(NotFoundEl, container);
        React.unmountComponentAtNode(container);

        done();
    });
});
