var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Button = require('../../../../client/components/form/Button');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


lab.experiment('Button', function () {

    lab.test('it renders normally', function (done) {

        var props = {
            children: 'Hi'
        };
        var ButtonEl = React.createElement(Button, props);
        var button = TestUtils.renderIntoDocument(ButtonEl);

        Code.expect(button.getDOMNode().textContent).to.equal('Hi');
        done();
    });


    lab.test('it renders disabled', function (done) {

        var props = {
            children: 'Hi',
            disabled: true
        };
        var ButtonEl = React.createElement(Button, props);
        var button = TestUtils.renderIntoDocument(ButtonEl);

        Code.expect(button.getDOMNode().disabled).to.equal(true);
        done();
    });


    lab.test('it calls the click handler', function (done) {

        var props = {
            children: 'Hi',
            onClick: function (event) {

                Code.expect(event).to.exist();
                done();
            }
        };
        var ButtonEl = React.createElement(Button, props);
        var button = TestUtils.renderIntoDocument(ButtonEl);

        TestUtils.Simulate.click(button.getDOMNode());
    });
});
