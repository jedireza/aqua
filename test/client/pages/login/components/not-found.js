var React = require('react');
var Lab = require('lab');
var Code = require('code');
var StubRouterContext = require('../../../fixtures/StubRouterContext');
var NotFound = require('../../../../../client/pages/login/components/not-found');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


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

        React.render(NotFoundEl, container);
        React.unmountComponentAtNode(container);

        done();
    });
});
