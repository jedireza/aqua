var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Footer = require('../../../../../client/pages/admin/components/Footer');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


lab.experiment('Admin Footer', function () {

    lab.test('it renders normally', function (done) {

        var FooterEl = React.createElement(Footer, {});
        var footer = TestUtils.renderIntoDocument(FooterEl);

        Code.expect(footer).to.exist();
        done();
    });
});
