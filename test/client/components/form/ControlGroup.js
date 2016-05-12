var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Lab = require('lab');
var Code = require('code');
var ControlGroup = require('../../../../client/components/form/ControlGroup.jsx');


var lab = exports.lab = Lab.script();


lab.experiment('ControlGroup', function () {

    lab.test('it renders normally', function (done) {

        var props = {
            children: 'Hi'
        };
        var ControlGroupEl = React.createElement(ControlGroup, props);
        var controlGroup = TestUtils.renderIntoDocument(ControlGroupEl);

        Code.expect(ReactDOM.findDOMNode(controlGroup).textContent).to.equal('Hi');
        done();
    });


    lab.test('it renders without label or help elements', function (done) {

        var props = {
            children: 'Hi',
            hideLabel: true,
            hideHelp: true
        };
        var ControlGroupEl = React.createElement(ControlGroup, props);
        var controlGroup = TestUtils.renderIntoDocument(ControlGroupEl);
        var labelEls = TestUtils.scryRenderedDOMComponentsWithTag(controlGroup, 'label');
        var helpEls = TestUtils.scryRenderedDOMComponentsWithClass(controlGroup, 'help-block');

        Code.expect(labelEls.length).to.equal(0);
        Code.expect(helpEls.length).to.equal(0);

        done();
    });
});
