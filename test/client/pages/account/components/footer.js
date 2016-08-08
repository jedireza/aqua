var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Lab = require('lab');
var Code = require('code');
var Footer = require('../../../../../client/pages/account/components/footer');


var lab = exports.lab = Lab.script();


lab.experiment('Account Footer', function () {

    lab.test('it renders normally', function (done) {

        var FooterEl = React.createElement(Footer, {});
        var footer = TestUtils.renderIntoDocument(FooterEl);

        Code.expect(footer).to.exist();
        done();
    });
});
