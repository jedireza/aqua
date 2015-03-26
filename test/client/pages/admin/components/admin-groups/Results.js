var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Results = require('../../../../../../client/pages/admin/components/admin-groups/Results');
var StubRouterContext = require('../../../../fixtures/StubRouterContext');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


lab.experiment('Admin Admin Group Results', function () {

    lab.test('it renders normally', function (done) {

        var ResultsEl = React.createElement(Results, {});
        var results = TestUtils.renderIntoDocument(ResultsEl);

        Code.expect(results).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var ResultsEl = React.createElement(Results, {});

        React.render(ResultsEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it renders with data', function (done) {

        var mockProps = {
            data: [{ _id: '1D' }, { _id: '2D' }]
        };
        var ResultsWithContext = StubRouterContext(Results, {});
        var ResultsEl = React.createElement(ResultsWithContext, mockProps);
        var results = TestUtils.renderIntoDocument(ResultsEl);

        Code.expect(results).to.exist();
        done();
    });
});
