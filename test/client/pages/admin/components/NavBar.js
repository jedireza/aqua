var React = require('react');
var ReactDOM = require('react-dom');
var Lab = require('lab');
var Code = require('code');
var NavBar = require('../../../../../client/pages/admin/components/NavBar.jsx');
var StubRouterContext = require('../../../fixtures/StubRouterContext');


var lab = exports.lab = Lab.script();
var TestUtils = require('react-addons-test-utils');


lab.experiment('Admin NavBar', function () {

    lab.test('it renders normally', function (done) {

        var ComponentWithContext = StubRouterContext(NavBar, {});
        var NavBarEl = React.createElement(ComponentWithContext, {});
        var mainElement = TestUtils.renderIntoDocument(NavBarEl);

        Code.expect(mainElement).to.exist();
        done();
    });


    lab.test('it toggles the menu', function (done) {

        var ComponentWithContext = StubRouterContext(NavBar, {});
        var NavBarEl = React.createElement(ComponentWithContext, {});
        var mainElement = TestUtils.renderIntoDocument(NavBarEl);
        var button = TestUtils.findRenderedDOMComponentWithTag(mainElement, 'button');
        var menuDiv = TestUtils.findRenderedDOMComponentWithClass(mainElement, 'navbar-collapse');
        var menuDivNode = ReactDOM.findDOMNode(menuDiv);

        Code.expect(menuDivNode.className).to.equal('navbar-collapse collapse');
        TestUtils.Simulate.click(ReactDOM.findDOMNode(button));

        Code.expect(menuDivNode.className).to.equal('navbar-collapse');

        done();
    });


    lab.test('it receives new props', function (done) {

        var ComponentWithContext = StubRouterContext(NavBar, {});
        var NavBarEl = React.createElement(ComponentWithContext, {});
        var mainElement = TestUtils.renderIntoDocument(NavBarEl);

        NavBarEl = React.createElement(ComponentWithContext, Object.assign({}, mainElement.props, { foo: 'bar' }));

        mainElement = TestUtils.renderIntoDocument(NavBarEl);

        Code.expect(mainElement).to.exist();
        done();
    });
});
