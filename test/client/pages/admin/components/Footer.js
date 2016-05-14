var React = require('react');
var Lab = require('lab');
var Code = require('code');
var Footer = require('../../../../../client/pages/admin/components/Footer.jsx');


var lab = exports.lab = Lab.script();
var TestUtils = require('react-addons-test-utils');


lab.experiment('Admin Footer', function () {

    lab.test('it renders normally', function (done) {

        var FooterEl = React.createElement(Footer, {});
        var footer = TestUtils.renderIntoDocument(FooterEl);

        Code.expect(footer).to.exist();
        done();
    });
});
