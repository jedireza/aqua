var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Lab = require('lab');
var Code = require('code');
var TextareaControl = require('../../../../client/components/form/TextareaControl.jsx');


var lab = exports.lab = Lab.script();


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

        Code.expect(ReactDOM.findDOMNode(textarea).disabled).to.equal(true);
        done();
    });
});
