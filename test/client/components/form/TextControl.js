var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var TextControl = require('../../../../client/components/form/TextControl');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


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
