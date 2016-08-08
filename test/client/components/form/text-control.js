var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Lab = require('lab');
var Code = require('code');
var TextControl = require('../../../../client/components/form/text-control');


var lab = exports.lab = Lab.script();


lab.experiment('TextControl', function () {

    lab.test('it renders normally', function (done) {

        var props = {};
        var TextControlEl = React.createElement(TextControl, props);
        var textControl = TestUtils.renderIntoDocument(TextControlEl);
        var input = TestUtils.findRenderedDOMComponentWithTag(textControl, 'input');

        Code.expect(input).to.exist();
        done();
    });


    lab.test('it renders disabled', function (done) {

        var props = {
            disabled: true
        };
        var TextControlEl = React.createElement(TextControl, props);
        var textControl = TestUtils.renderIntoDocument(TextControlEl);
        var input = TestUtils.findRenderedDOMComponentWithTag(textControl, 'input');

        Code.expect(input.getDOMNode().disabled).to.equal(true);
        done();
    });
});
