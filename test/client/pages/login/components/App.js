var React = require('react/addons');
var ReactRouter = require('react-router');
var Lab = require('lab');
var Code = require('code');
var App = require('../../../../../client/pages/login/components/App');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
var Route = ReactRouter.Route;
var Routes = React.createElement(Route, {
    name: 'app', path: '/login', handler: App
});


lab.experiment('Login App Component', function () {

    lab.test('it renders normally', function (done) {

        ReactRouter.run(Routes, '/login', function (Handler) {

            var HandlerEl = React.createElement(Handler, {});
            var mainElement = TestUtils.renderIntoDocument(HandlerEl);

            Code.expect(mainElement).to.exist();
            done();
        });
    });
});
