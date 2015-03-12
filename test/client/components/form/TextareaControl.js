var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var TextareaControl = require('../../../../client/components/form/TextareaControl');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


lab.experiment('TextareaControl', function () {

    lab.test('it renders normally', function (done) {

        var props = {};
        var TextareaControlEl = React.createElement(TextareaControl, props);
        var textareaControl = TestUtils.renderIntoDocument(TextareaControlEl);
        var textarea = TestUtils.findRenderedDOMComponentWithTag(textareaControl, 'textarea');

        Code.expect(textarea).to.exist();
        done();
    });


    lab.test('it renders disabled', function (done) {

        var props = {
            disabled: true
        };
        var TextareaControlEl = React.createElement(TextareaControl, props);
        var textareaControl = TestUtils.renderIntoDocument(TextareaControlEl);
        var textarea = TestUtils.findRenderedDOMComponentWithTag(textareaControl, 'textarea');

        Code.expect(textarea.getDOMNode().disabled).to.equal(true);
        done();
    });
});
