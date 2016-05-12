var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Lab = require('lab');
var Code = require('code');
var Spinner = require('../../../../client/components/form/Spinner.jsx');


var lab = exports.lab = Lab.script();


lab.experiment('Spinner', function () {

    lab.test('it renders normally', function (done) {

        var props = {};
        var SpinnerEl = React.createElement(Spinner, props);
        var spinner = TestUtils.renderIntoDocument(SpinnerEl);
        var klass = ReactDOM.findDOMNode(spinner).getAttribute('class');

        Code.expect(klass).to.equal('hidden');
        done();
    });


    lab.test('it renders visible', function (done) {

        var props = {
            show: true
        };
        var SpinnerEl = React.createElement(Spinner, props);
        var spinner = TestUtils.renderIntoDocument(SpinnerEl);
        var klass = ReactDOM.findDOMNode(spinner).getAttribute('class');

        Code.expect(klass).to.equal('');
        done();
    });


    lab.test('it renders with space on the left', function (done) {

        var props = {
            space: 'left'
        };
        var SpinnerEl = React.createElement(Spinner, props);
        var spinner = TestUtils.renderIntoDocument(SpinnerEl);
        var text = ReactDOM.findDOMNode(spinner).textContent;

        Code.expect(text[0]).to.equal('\u00A0');
        done();
    });


    lab.test('it renders with space on the right', function (done) {

        var props = {
            space: 'right'
        };
        var SpinnerEl = React.createElement(Spinner, props);
        var spinner = TestUtils.renderIntoDocument(SpinnerEl);
        var text = ReactDOM.findDOMNode(spinner).textContent;

        Code.expect(text[text.length - 1]).to.equal('\u00A0');
        done();
    });
});
